## Database model upgrade
1. alembic revision --autogenerate
2. alembic upgrade head

## Stripe Test

- 登录：stripe login，登录一次90天
- 本地测试：stripe listen --forward-to localhost:8001/ai-visa/api/v1/stripe/webhook
- webhook: stripe trigger payment_intent.succeeded
  - payment_intent.succeeded
  - subscription_schedule.canceled
  - invoice.upcoming
  - charge.captured
  - invoice.payment_succeed