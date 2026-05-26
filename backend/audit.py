def log_change(conn, table_name, row_id, action, user_id, field_name=None, old_value=None, new_value=None, summary=None):
    conn.execute(
        'INSERT INTO audit_log (table_name, row_id, action, field_name, old_value, new_value, summary, user_id) VALUES (?,?,?,?,?,?,?,?)',
        (table_name, row_id, action, field_name, old_value, new_value, summary, user_id)
    )
