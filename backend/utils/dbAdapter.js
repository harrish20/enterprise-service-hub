const fs = require('fs');
const path = require('path');
const { DATA_FILE, initDatabase } = require('../config/database');

// Ensure DB is initialized
initDatabase();

function readDB() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[dbAdapter] Read error, reinitializing:', err.message);
    initDatabase();
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
}

function writeDB(data) {
  try {
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    console.error('[dbAdapter] Write error:', err.message);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }
}

// User Model
const User = {
  find: async (query = {}) => {
    const db = readDB();
    let users = db.users || [];
    if (query.role) {
      users = users.filter(u => u.role === query.role);
    }
    return users;
  },
  findOne: async (query = {}) => {
    const db = readDB();
    const users = db.users || [];
    return users.find(u => {
      if (query.email && u.email.toLowerCase() !== query.email.toLowerCase()) return false;
      if (query._id && u._id !== query._id) return false;
      return true;
    }) || null;
  },
  findById: async (id) => {
    const db = readDB();
    return (db.users || []).find(u => u._id === id) || null;
  },
  create: async (userData) => {
    const db = readDB();
    const newUser = {
      _id: `usr_${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString()
    };
    db.users = db.users || [];
    db.users.push(newUser);
    writeDB(db);
    return newUser;
  }
};

// Department Model
const Department = {
  find: async () => {
    const db = readDB();
    return db.departments || [];
  }
};

// ServiceRequest Model
const ServiceRequest = {
  find: (query = {}) => {
    const db = readDB();
    let items = [...(db.requests || [])];

    // Filter by query conditions
    if (query.status) {
      if (typeof query.status === 'string') {
        items = items.filter(r => r.status.toLowerCase() === query.status.toLowerCase());
      } else if (query.status.$in) {
        const set = query.status.$in.map(s => s.toLowerCase());
        items = items.filter(r => set.includes(r.status.toLowerCase()));
      }
    }

    if (query.priority) {
      items = items.filter(r => r.priority.toLowerCase() === query.priority.toLowerCase());
    }

    if (query.category) {
      items = items.filter(r => r.category.toLowerCase() === query.category.toLowerCase());
    }

    if (query.$or) {
      // Regex search across fields
      items = items.filter(r => {
        return query.$or.some(clause => {
          if (clause.ticketId?.$regex) {
            const reg = new RegExp(clause.ticketId.$regex, clause.ticketId.$options || 'i');
            if (reg.test(r.ticketId)) return true;
          }
          if (clause.title?.$regex) {
            const reg = new RegExp(clause.title.$regex, clause.title.$options || 'i');
            if (reg.test(r.title)) return true;
          }
          if (clause.description?.$regex) {
            const reg = new RegExp(clause.description.$regex, clause.description.$options || 'i');
            if (reg.test(r.description)) return true;
          }
          return false;
        });
      });
    }

    // Return query chain builder for sort, skip, limit, populate
    const chain = {
      _items: items,
      sort(criteria) {
        const [field, order] = Object.entries(criteria)[0] || ['createdAt', -1];
        this._items.sort((a, b) => {
          let valA = a[field] || '';
          let valB = b[field] || '';
          if (order === 1 || order === 'asc') return valA > valB ? 1 : -1;
          return valA < valB ? 1 : -1;
        });
        return this;
      },
      skip(count) {
        this._items = this._items.slice(count);
        return this;
      },
      limit(count) {
        this._items = this._items.slice(0, count);
        return this;
      },
      populate(field, select) {
        // Already populated in seed / creation, but ensures consistent references
        return this;
      },
      then(resolve) {
        resolve(this._items);
      }
    };

    return chain;
  },

  countDocuments: async (query = {}) => {
    const chain = ServiceRequest.find(query);
    return chain._items ? chain._items.length : (await chain).length;
  },

  findById: async (id) => {
    const db = readDB();
    const req = (db.requests || []).find(r => r._id === id || r.ticketId === id);
    if (!req) return null;

    // Attach save() helper
    return {
      ...req,
      save: async function () {
        const currentDb = readDB();
        const idx = (currentDb.requests || []).findIndex(r => r._id === this._id);
        if (idx !== -1) {
          currentDb.requests[idx] = { ...this };
          writeDB(currentDb);
        }
        return this;
      }
    };
  },

  create: async (data) => {
    const db = readDB();
    db.requests = db.requests || [];
    
    // Auto ticket ID generation if not provided
    const count = db.requests.length + 1001;
    const ticketId = data.ticketId || `SR-${count}`;

    const newReq = {
      _id: `req_${Date.now()}`,
      ticketId,
      title: data.title,
      description: data.description,
      category: data.category || 'IT Infrastructure',
      priority: data.priority || 'Medium',
      status: data.status || 'Open',
      requestedBy: data.requestedBy || { name: 'Portal User', role: 'Requester' },
      assignedTo: data.assignedTo || null,
      department: data.department || 'Information Technology',
      sla: data.sla || '24 Hours',
      aiSummary: data.aiSummary || '',
      comments: data.comments || [],
      history: data.history || [
        {
          id: `h_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'TICKET_CREATED',
          details: `Service request submitted: ${data.title}`,
          user: data.requestedBy?.name || 'Portal User'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.requests.unshift(newReq);
    writeDB(db);
    return newReq;
  },

  findByIdAndUpdate: async (id, update, options = {}) => {
    const db = readDB();
    const idx = (db.requests || []).findIndex(r => r._id === id || r.ticketId === id);
    if (idx === -1) return null;

    const existing = db.requests[idx];
    const updated = {
      ...existing,
      ...update,
      updatedAt: new Date().toISOString()
    };
    db.requests[idx] = updated;
    writeDB(db);
    return updated;
  },

  aggregate: async (pipeline = []) => {
    const db = readDB();
    let requests = [...(db.requests || [])];

    // Simple robust evaluator for common aggregations used in the system
    for (const stage of pipeline) {
      if (stage.$match) {
        const m = stage.$match;
        requests = requests.filter(r => {
          if (m.status?.$in) {
            if (!m.status.$in.includes(r.status)) return false;
          }
          if (m.assignedTo?.$ne !== undefined) {
            if (r.assignedTo === null || r.assignedTo === undefined) return false;
          }
          return true;
        });
      }

      if (stage.$group) {
        const grp = stage.$group;
        const key = grp._id.replace('$', '');
        const map = {};
        requests.forEach(r => {
          const val = (r[key] && typeof r[key] === 'object') ? r[key].name || r[key]._id : r[key] || 'Unassigned';
          map[val] = (map[val] || 0) + 1;
        });
        return Object.entries(map).map(([k, v]) => ({ _id: k, count: v, activeCount: v }));
      }
    }

    return requests;
  }
};

// ActivityLog Model
const ActivityLog = {
  create: async (log) => {
    const db = readDB();
    const entry = {
      _id: `act_${Date.now()}`,
      ...log,
      createdAt: new Date().toISOString()
    };
    db.activityLogs = db.activityLogs || [];
    db.activityLogs.unshift(entry);
    writeDB(db);
    return entry;
  },
  find: async (query = {}) => {
    const db = readDB();
    return db.activityLogs || [];
  }
};

module.exports = {
  User,
  Department,
  ServiceRequest,
  ActivityLog,
  readDB,
  writeDB
};

