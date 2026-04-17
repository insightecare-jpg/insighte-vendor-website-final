# Insighte Payout Portal — Project Configuration

## Vercel Deployment
- **Project ID**: prj_TvZDQg1DeTgJmZHPDY5RxBE3PM8S
- **Deployment URL**: https://insighte-session-logger-fi3x5066i-midhuns-projects-cc6f150a.vercel.app
- **Domain**: https://insighte-session-logger.vercel.app
- **Repo**: insighte-session-logger-
- **Branch**: main

## Supabase (Dedicated Payout Project)
- **Project ID**: dhlxkzvgdkytcyguxvxr
- **URL**: https://dhlxkzvgdkytcyguxvxr.supabase.co
- **Anon Key (Publishable)**: sb_publishable_lgLh8C3JOzvYoyYg8ymmEQ_x-v2mGH2
- **Anon Key (JWT)**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobHhrenZnZGt5dGN5Z3V4dnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODM0NzYsImV4cCI6MjA4OTE1OTQ3Nn0.GQybPpaAFMiePAneZhoVejM0SLVEPYW7W5gLeOiUY1A

## Database Tables
- **employees**: employee_id (unique), name, email, role
- **payouts**: employee_id (FK), name, month, year, gross_pay, tds, net_pay, status

## Google Sheets Source
- **Sheet ID**: 11ABJe6Hvno0AjOxXgOxmlg-waCkpTixzSH8qUdsCOPo
- **Sync Method**: Google Apps Script (menu: Insighte → Sync Current Sheet)

## ⚠️ DEMARCATION
- This Supabase project is ONLY for payout data.
- SPOT Website uses the OTHER Supabase project (tsvatfnvofxiycnhpxfq).
- See PROJECT_DEMARCATION.md for details.
