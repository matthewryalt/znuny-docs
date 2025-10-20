# 🧩 Znuny Ticket Correction Utility (MariaDB)

This utility script allows administrators to **fix incorrectly entered tickets** directly in the **MariaDB database** without requiring `sudo` or the Znuny `console.pl` command.

You can use it to:
- Correct the **direction** of a ticket (Inbound ↔ Outbound)
- Update the **title** of a ticket
- Verify and display the changes made

---

## ⚙️ Overview

Znuny stores ticket information in the `ticket` and `article` tables.  
Each article has a `article_sender_type_id` field that determines the message direction:

| ID | Type      | Description          |
|----|------------|----------------------|
| 1  | Agent      | Outbound message     |
| 3  | Customer   | Inbound message      |

This script automatically detects and flips the direction and allows manual title correction.

---

## 📄 Script: `fix_ticket_prompt.sql`

Save this file as `/tmp/fix_ticket_prompt.sql` or another convenient path.

```sql
-- ============================================================
-- Znuny Ticket Fix Utility (Interactive Version)
-- Lets you choose a ticket number, updates title and direction
-- ============================================================

-- ⚙️ Ask for the public ticket number (tn)
SET @TicketNumber = (SELECT TRIM(CONVERT(@@prompt_ticket USING utf8mb4)));

-- For interactive use:
-- In MariaDB CLI, run like:
--   mysql> SET @prompt_ticket='2025100710000028'; SOURCE /tmp/fix_ticket_prompt.sql;
-- Or just paste this file and set @prompt_ticket manually above

-- Look up internal ID
SELECT id INTO @TicketID FROM ticket WHERE tn = @TicketNumber;

SELECT CONCAT('Editing Ticket ID: ', @TicketID, ' (TN: ', @TicketNumber, ')') AS Info;

-- 🧩 Show basic info
SELECT 
    t.id AS TicketID,
    t.tn AS TicketNumber,
    t.title AS Title,
    q.name AS Queue,
    s.name AS State,
    p.name AS Priority
FROM ticket t
LEFT JOIN queue q ON t.queue_id = q.id
LEFT JOIN ticket_state s ON t.ticket_state_id = s.id
LEF
