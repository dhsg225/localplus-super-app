# Page snapshot

```yaml
- text: LP
- heading "Partner Portal Login" [level=2]
- paragraph: Sign in to manage your restaurant bookings
- paragraph: 🔄 Direct Supabase Authentication
- text: Email*
- textbox "Email*": invalid-email
- text: Password*
- textbox "Password*": TestPassword123!
- text: Select Business*
- combobox "Select Business*" [disabled]:
  - option "No businesses available" [disabled] [selected]
- button "Sign In"
- button "Create Partner Account" [disabled]
- button "🔧 Development Bypass"
- paragraph: "Test credentials: shannon@localplus.com / testpass123"
- paragraph: ⚠️ Use Development Bypass if email not confirmed
```