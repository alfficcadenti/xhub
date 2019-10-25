const sql = require('mssql')

async function incidentQuery(config) {
    const password = config.get('secrets.password');
    const dbConfig = config.get('dbConfig');

    dbConfig.authentication.options['password'] = password;

    const query = `SELECT  a.number as 'Incident' ,
    DATEADD(hh,+7,a.u_incident_start_date) as 'StartDate',
    DATEADD(hh,+7,a.u_incident_end_date) as 'EndDate',
    DATEADD(hh,+7,a.opened_at) as 'OpenDate',
    DATEADD(hh,+7,a.resolved_at) as 'ResolvedDate',
    a.dv_incident_state as 'ticketStatus',
    u_brand_product_site_service_a as 'Short Description',
    close_notes as 'Root Cause',
    a.dv_u_root_cause_owner AS 'Root Cause Owner',
    g.L3_Business_Owner as 'Business Owner',
    g.L1_Business_Owner as 'Brand',
    dv_cmdb_ci as 'Host',
    a.dv_assigned_to as 'Assignee',
    a.dv_assignment_group as 'Queue', 
    a.dv_opened_by as 'Opened by', 
    a.dv_priority as 'ticketPriority',
    a.u_time_to_detect as TTD, 
    a.u_time_to_repair as TTR, 
    a.u_incident_duration as 'Inc Duration'
    from incident a left join cmdb_ci_server b on a.dv_cmdb_ci= b.name 
    left join [dbo].[v_ct_ou_rollup_v2] d on d.cost_center_sys_id = b.cost_center
    left join sys_user_group e on a.u_root_cause_owner = e.sys_id
    left join sys_user h on e.manager = h.sys_id 
    left join [dbo].[v_ct_ou_rollup_v2] g on g.cost_center_sys_id = h.cost_center
    WHERE a.dv_assignment_group = 'Incident Management' AND a.active is NOT NULL AND a.dv_u_environment = 'Production' AND a.priority IN (1,2)
    AND (a.u_incident_end_date) > '2019-08-01 00:00:00.0000000' `

  return new sql.ConnectionPool(dbConfig).connect().then(pool => {
    return  pool.query(query)
    }).then((result) => {
        // eslint-disable-next-line no-console
        console.log(result)
        return result;
    }).catch(err => {
        // eslint-disable-next-line no-console
        console.log('incident query',  err)
        return {err};
    })
}

export default incidentQuery;