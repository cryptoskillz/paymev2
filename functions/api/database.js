export async function onRequest(context) { 
  // Create a prepared statement with our query
  //const ps = context.env.database.prepare('SELECT * from property'); 
  //const result = await ps.first();
  //console.log(data)
  console.log(context.env)
  //return Response.json(data)

  return Response.json(context.env.test3);
}