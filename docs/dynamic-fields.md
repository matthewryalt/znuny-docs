# Dynamic Fields in Znuny

Dynamic fields allow you to extend ticket data with custom inputs like dropdowns, text fields, dates, and more.

## Creating a Dynamic Field

1. Go to **Admin → Dynamic Fields**
2. Click **Add Dynamic Field**
3. Choose the field type (e.g., Text, Dropdown, Date)
4. Configure visibility, permissions, and default values

## Use Cases

- HRV ID (IT Support Ticket Number)
- Other ID (Spark, Ricoh, lancom + others)
- Add custom tags for reporting

## Linking to Ticket Views

You can display dynamic fields in:
- Ticket Phone (inboundTicket::Frontend::AgentTicketPhone###DynamicField
- Ticket Email (outbound)Ticket::Frontend::AgentTicketEmail###DynamicField
- Ticket Search (to be added)

For advanced usage, check out the [Znuny documentation](https://doc.znuny.org/legacy/manual/admin/6.0/en/html/dynamicfields.html#dynamicfields-configuration).

