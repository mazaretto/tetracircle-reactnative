import React, { useState } from 'react'
import { ImageBackground } from 'react-native'
import { NativeRouter, Route } from 'react-router-native'

import ChangeGameScreen from './components/ChangeGameScreen'
import GameScreen from './components/GameScreen'
import MenuScreen from './components/MenuScreen'

import BackgroundImage from './assets/bg.png'
import { AppLoading } from 'expo'

import { GetAllFonts } from './Functions'
import SyncStorage from 'sync-storage'

const App = () => {
  let [fontsLoaded, setfontsLoaded] = useState(false)

  const LoadFonts = async () => {
    await GetAllFonts()
    setfontsLoaded(true)
  }

  if (!fontsLoaded) {
    LoadFonts()

    SyncStorage.init()

    return <AppLoading />
  }

  return <NativeRouter>
    <ImageBackground
      source={BackgroundImage}
      style={{width: '100%', height: '100%'}}
    >
      <Route exact path="/" component={MenuScreen} />
      <Route path="/game/:gameId/:gameLVL?" component={GameScreen} />
      <Route path="/games" component={ChangeGameScreen} />
    </ImageBackground>
  </NativeRouter>
}

export default App