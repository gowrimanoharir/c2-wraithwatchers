import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { checkRateLimit, getClientIP } from '../../../lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const clientIP = getClientIP(request);
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many submissions. Please try again later.',
          resetAt: rateLimit.resetAt.toISOString()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.getTime().toString(),
            'Retry-After': Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.dateOfSighting || !body.latitude || !body.longitude || !body.tag || !body.notes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into database (IP already checked for rate limiting)
    const { data, error } = await supabase
      .from('sightings')
      .insert({
        date_of_sighting: body.dateOfSighting,
        latitude: body.latitude,
        longitude: body.longitude,
        city: body.city || 'Unknown',
        state: body.state || 'Unknown',
        notes: body.notes,
        time_of_day: body.timeOfDay,
        tag: body.tag,
        image_link: body.imageLink || ''
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save sighting' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data,
        rateLimit: {
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt
        }
      },
      {
        headers: {
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetAt.getTime().toString()
        }
      }
    );

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

