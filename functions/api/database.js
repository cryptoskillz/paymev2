export async function onRequest(context) { 
    console.log(context.env)
  // Create a prepared statement with our query
  const ps = context.env.DB.prepare('SELECT * from property'); 
  const result = await ps.first();
  console.log(result)

  return Response.json(result)

  //return Response.json(context.env.DB);
}