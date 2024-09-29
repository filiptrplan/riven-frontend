import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  let json;
  try {
    json = await request.json();
  } catch {
    return new Response(JSON.stringify({
      error: 'Failed to parse request body'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  if (!json.imdb_ids) {
    return new Response(JSON.stringify({
      error: 'No IMDb IDs provided'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const response = await fetch(`${locals.BACKEND_URL}/items/index?imdb_ids=${json.imdb_ids.toString()}`, {
      method: 'POST',
    });

    const data = await response.json();
    if (response.ok) {
      return new Response(JSON.stringify({
        success: 'Media items indexed and added',
        data: data.items
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({
        error: data.detail
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch {
    return new Response(JSON.stringify({
      error: 'Failed to index media items'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}