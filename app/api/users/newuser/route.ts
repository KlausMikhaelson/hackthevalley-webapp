import { Webhook } from 'svix'
import { headers } from 'next/headers'

import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
    }

    const wh = new Webhook(SIGNING_SECRET)

    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    if (!payload) {
        return new Response('Error: No payload received', {
            status: 400,
        })
    }

    console.log('Received webhook payload:', body);

    let evt

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        })
    } catch (err) {
        console.error('Webhook verification failed:', err);
        // @ts-ignore
        return new Response(`Webhook verification failed: ${err.message}`, {
            status: 400,
        })
    }

    // Parse the webhook event
    const event = evt
    // @ts-ignore
    const { id } = event.data
    // @ts-ignore
    const eventType = event.type

    if (eventType === 'user.created') {
        try {
            // Connect to MongoDB
            await connectDB();

            const newUser = await User.create({
                clerk_id: id,
                // @ts-ignore
                email: event.data.email_addresses[0].email_address,
                // @ts-ignore
                fullname: `${event.data.first_name} ${event.data.last_name}`,
                // @ts-ignore
                avatar_url: event.data.image_url
            });

            console.log('Successfully created user:', newUser);

            return new Response(JSON.stringify({ success: true, user: newUser }), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        } catch (error) {
            console.error('Error creating user:', {
                // @ts-ignore
                error: error.message,
                // @ts-ignore
                stack: error.stack
            });
            return new Response(JSON.stringify({ 
                success: false, 
                // @ts-ignore
                error: error.message,
                // @ts-ignore
                details: error.stack 
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }
    }

    return new Response(JSON.stringify({ success: true, message: 'Webhook processed' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    })
}