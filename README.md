# SaaS App Template

A modern SaaS application template built with Next.js, Supabase, and Stripe.

## Features

- 🔐 Authentication with Supabase
- 💳 Subscription management with Stripe
- 📧 Email notifications with Nodemailer
- 🎨 Modern UI with Tailwind CSS and Shadcn UI
- 📱 Fully responsive design
- 🔒 Type-safe with TypeScript
- 🚀 Fast and optimized with Next.js

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/saas-app.git
   cd saas-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your own values.

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── pricing/           # Pricing page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── ui/               # UI components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utility functions and configurations
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe client
│   └── email.ts          # Email service
└── types/                # TypeScript type definitions
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend and authentication
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation
- [Nodemailer](https://nodemailer.com/) - Email service

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 