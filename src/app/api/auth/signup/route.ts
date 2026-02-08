import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'candidate', // Default to candidate if not specified
        });

        return NextResponse.json(
            { message: 'User created successfully', userId: newUser._id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
