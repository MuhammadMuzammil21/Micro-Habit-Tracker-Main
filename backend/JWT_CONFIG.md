# JWT Configuration

## ✅ JWT Secrets Configured

Your JWT secrets have been set to:

```
JWT_SECRET=438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c
JWT_REFRESH_SECRET=438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c
```

## Verification

To verify your `.env` file has the correct JWT secrets:

1. Open `backend/.env` file
2. Check that it contains:
   ```env
   JWT_SECRET=438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c
   JWT_REFRESH_SECRET=438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c
   ```

## If .env file doesn't exist

Run this command in the `backend` directory:
```bash
cp .env.example .env
```

The `.env.example` file already contains the configured JWT secrets.

## Security Reminder

⚠️ **Never commit the `.env` file to version control!** It's already in `.gitignore`.

