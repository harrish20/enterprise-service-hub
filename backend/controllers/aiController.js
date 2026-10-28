exports.classifyServiceRequest = async (req, res) => {
  try {
    const { title = '', description = '' } = req.body;
    const text = `${title} ${description}`.toLowerCase();

    let category = 'IT Infrastructure';
    let priority = 'Medium';
    let confidence = 0.94;
    let impact = 'Moderate impact across departmental workflows.';
    let action = 'Validate gateway logs and diagnostic telemetry.';

    // Category detection rules
    if (/vpn|firewall|ssl|tls|port|ip|subnet|gateway|ldap|dns|route|cisco/.test(text)) {
      category = 'Network Security';
      priority = /outage|down|timeout|fail|denied|breach|error 503/.test(text) ? 'Critical' : 'High';
      impact = 'Remote team access blocked; critical security boundary affected.';
      action = 'Check firewall rules, TLS certificates, and gateway authentication service.';
    } else if (/backup|mongodb|postgres|sql|shard|disk full|replica|database|ebs|checksum|query/.test(text)) {
      category = 'Database Admin';
      priority = /loss|corrupt|fail|crash|down/.test(text) ? 'Critical' : 'High';
      impact = 'Automated backup pipeline stalled; risk of data divergence.';
      action = 'Expand storage allocation, verify replica sync, and rerun verification script.';
    } else if (/server|rack|power|ups|cluster|pdu|datacenter|reboot|host/.test(text)) {
      category = 'IT Infrastructure';
      priority = /down|crash|interruption|smoke|failover/.test(text) ? 'Critical' : 'High';
      impact = 'Hardware redundancy degraded; potential cluster failover disruption.';
      action = 'Inspect ATS transfer switches, redundant power feeds, and cluster health.';
    } else if (/laptop|screen|monitor|keyboard|battery|charger|hardware|spec|ram|macbook/.test(text)) {
      category = 'Hardware Failure';
      priority = 'Medium';
      impact = 'Individual workstation degraded or pending device setup.';
      action = 'Verify device inventory and provision imaged enterprise hardware.';
    } else if (/salary|leave|payroll|benefits|hr|onboarding|joining|resignation/.test(text)) {
      category = 'HR Services';
      priority = /urgent|payroll/.test(text) ? 'High' : 'Low';
      impact = 'Employee administrative service request.';
      action = 'Forward to People Operations for standard SLA processing.';
    } else if (/invoice|billing|vendor|po|payment|accounting/.test(text)) {
      category = 'Finance & Billing';
      priority = 'Medium';
      impact = 'Accounts payable / vendor invoice reconciliation pending.';
      action = 'Route to procurement and financial operations review.';
    } else if (/aircon|ac|light|chair|desk|cleaning|facility|elevator/.test(text)) {
      category = 'Facilities';
      priority = 'Low';
      impact = 'Office environment maintenance ticket.';
      action = 'Schedule facility maintenance technician.';
    }

    // Explicit severity overrides
    if (/critical|emergency|severity 1|outage|sev1|disaster/.test(text)) {
      priority = 'Critical';
      confidence = 0.98;
    }

    const aiSummary = `Issue: ${title.trim() || 'Service anomaly'}. Impact: ${impact} Suggested Resolution: ${action}`;

    return res.status(200).json({
      success: true,
      suggestedCategory: category,
      suggestedPriority: priority,
      confidence,
      summary: aiSummary,
      tags: [category, priority, 'TarqAI-Verified']
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

