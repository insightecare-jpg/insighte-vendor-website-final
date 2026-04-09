# Project & Database Demarcation

This document defines the separation between the **Spot Website** and **Insighte Session Logger** projects within the Supabase ecosystem.

## 1. Insighte Session Logger (Payout Portal)
- **Supabase Project ID**: `dhlxkzvgdkytcyguxvxr`
- **Region**: `ap-southeast-2` (Sydney) 
- **Purpose**: Managing employee records and payout data.
- **Indicators**: `employee_id` and `name` are used together as unique indicators to add and delete payout data.
- **Active Files**: All files within the `insighte-session-logger-/` directory are exclusively associated with this Supabase project.

## 2. Spot Website (Main Project)
- **Supabase Project ID**: `tsvatfnvofxiycnhpxfq`
- **Region**: `ap-northeast-2` (Seoul)
- **Purpose**: Main company website, studios, events, and projects.
- **Note**: This project is **not** to be used for payout or session logging data. All payout-related tables incorrectly added to this project have been removed.

## Maintenance Protocol
- Ensure that environment variables and Supabase clients in the respective folders point to the correct project IDs.
- Migration scripts should be applied strictly to their corresponding Project ID.
