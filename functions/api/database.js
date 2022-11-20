export async function onRequest(context) { 



  // Create a prepared statement with our query
  console.log(context.env)
  
  const ps = context.env.database.prepare('SELECT * from property'); 
  const result = await ps.first();
  //console.log(data)
  return Response.json(result);
  
  //return Response.json("{'aaa':'bbb'}")
}