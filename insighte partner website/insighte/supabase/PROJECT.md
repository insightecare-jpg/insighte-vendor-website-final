# Supabase Project: Insighte Sanctuary

## Credentials Reference

- **Project ID:** `riukjenrqfdsbvsessmk`
- **Project URL:** `https://riukjenrqfdsbvsessmk.supabase.co`
- **Database Host:** `db.riukjenrqfdsbvsessmk.supabase.co`
- **Anon Public Key:** `sb_publishable_yT1kRbDdtC6_JZL67P3P1Q_Ee0m_c3e`
- **Supabase JWT:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Database Connection
`postgresql://postgres:[YOUR-PASSWORD]@db.riukjenrqfdsbvsessmk.supabase.co:5432/postgres`

## Setup Tasks
- [ ] Complete **OAuth Link** for the newly configured MCP server in `mcp_config.json`.
- [ ] Execute `supabase/schema.sql` via SQL Editor in the Dashboard or `npx supabase db push`.
- [ ] Assign **RLS Policies** to ensure "Connection Before Correction" and parent/provider data segregation.

## MCP Server Configuration
The `~/.gemini/antigravity/mcp_config.json` has been updated with the following:

```json
"supabase": {
  "serverUrl": "https://mcp.supabase.com/mcp?project_ref=riukjenrqfdsbvsessmk"
}
```

> [!IMPORTANT]
> To enable the Supabase management tools, you must click the **Manage MCP Servers** menu in the Antigravity UI and complete the **Authentication Flow** for the `riukjenrqfdsbvsessmk` project.
