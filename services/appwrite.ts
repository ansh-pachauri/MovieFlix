import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const databases = new Databases(client);

export const updataSearchCount = async (query: string, movie: Movie) => {

  try{
    const trimmed = query?.trim();
    if (!trimmed) return;

  const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
    Query.equal("searchTerm", trimmed),
  ]);

  if(result.documents.length>0){
    const existingMovie = result.documents[0];
    await databases.updateDocument(DATABASE_ID, TABLE_ID, existingMovie.$id, {
      count: existingMovie.count + 1,
    });
    
  }else{
    await databases.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
      searchTerm: trimmed,
      movie_id: movie.id,
      count:1,
      poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      title: movie.title,
    })
  }
  }
  catch(error){
    console.log("Error:", error);
    throw error;
  }
  

 
};


export const getTrendingMovie = async (): Promise<TrendingMovie[] | undefined> =>{
  try{

  const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
    Query.limit(5),
    Query.orderDesc("count"),
  ]);

  return result.documents as unknown as TrendingMovie[];

  }catch(error){
    console.log("Error:", error);
    throw error;
  }
} 