import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '@/constants/images'
import MovieCard from '@/components/movieCard'
import useFetch from '@/services/useFetch'
import { fetchMovies } from '@/services/api'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'



const search = () => {

  const[searchQuery, setSearchQuery] = useState('');

  const {data:movies,
     loading:moviesLoading, 
     error: moviesError,
     refetch:loadMovies,
     reset: reset
    } = useFetch(() => fetchMovies({query: searchQuery}),false)

    useEffect(()=>{
      const func = async() =>{
        if(searchQuery.trim()){
          await loadMovies();
        } else {
          reset();
        }
      }
      func();
    },[searchQuery])


  return (
    <View  className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0'resizeMode='cover' />

      <FlatList
      data={movies}
      renderItem={({item}) => <MovieCard {...item} />}
      keyExtractor={(item) => item.id.toString()}
      className='px-5'
      numColumns={3}
      columnWrapperStyle={{
        justifyContent: "center",
        gap: 16,
        marginVertical: 16,
      }}
      contentContainerStyle={{
        paddingBottom:100
      }}

      ListHeaderComponent={
        <>
           <View className='w-full flex-row justify-center mt-20 items-center'>
            <Image  source={icons.logo} className='w-12 h-10'/>
           </View>

           <View className='my-5' >
            <SearchBar
              placeholder='Seach movies...'
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              
            />
           </View>

           {moviesLoading && (
            <ActivityIndicator size='large' color={'#000fff'} className='my-3' />
           )}

           {moviesError && (
            <Text className='text-red-500 my-3'>Error:{moviesError.message}</Text>
           )}

           {
            !moviesLoading && !moviesError && searchQuery.trim()
            && movies?.length>0 &&(
              <Text className='text-xl text-white font-bold'>
                Seach results for{' '}
                <Text className='text-accent'>{searchQuery}</Text>
              </Text>
            )
           }
        </>
      }
      />
    </View>
  )
}

export default search