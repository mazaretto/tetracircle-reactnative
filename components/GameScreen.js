import { AppLoading } from 'expo';
import React from 'react'
import { Button, Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Modal from 'react-native-modal';
import { Link } from 'react-router-native';
import Title from '../elements/Title';
import { playSound, randomElemArray, stopAllAudios } from '../Functions'
import STYLES from '../Styles'

const FIRST_LVL = {
    defaultTime: 1000, circleSpeed: 3
}
const DEFAULT_STATE_MENU = {
    rows: 2,
    balls: 0,
    invalidBalls: 0,
    lvl: 0,
    gameId: null,
    maxRows: 4,
    validRowsCount: 0,
    maxLVL: 2,
    gameStop: false,
    modalMenuVisible: false,
    gameEnd: false,
    gameReRender: false,

    lvlTriggerColored: false,

    gameTypeTrigger: () => {},

    defaultTimeAdd: 2000,
    ...FIRST_LVL
}

let GAME = {
    wv: Dimensions.get('window').width,
    wh: Dimensions.get('window').height,
    get gameMenuBottomHeight () {
        return this.wh / 4.5
    },
    get circleWH () {
        return (this.wv / 6) / 1.5
    },
    colors: ['green', 'red', 'blue', 'orange', 'purple']
}


class GameScene extends React.Component {
    state = {
        circles: [],
        color: [],
        validRows: {}
    }
    
    constructor (props) {
        super(props)
    }

    get getWidthGameScene () {
        return this.props.rows * GAME.circleWH*2 + (this.props.rows*8.5)
    }

    get getHeightScene () {
        return GAME.wh-GAME.gameMenuBottomHeight
    }

    updateColor = () => {
        const { gameId, rows } = this.props

        let defaultColor = randomElemArray(GAME.colors)
        let colorArray = []

        let randomIndex = Math.floor(Math.random() * rows)

        // Разноцветные шарики
        for(let i = 0; i < rows; i++) {
            let colorArrayItem = gameId == 1 ? randomElemArray(GAME.colors) : defaultColor

            if(randomIndex === i) {
                colorArray.push(colorArrayItem === defaultColor ? randomElemArray(GAME.colors) : colorArrayItem)
            } else {
                colorArray.push(defaultColor)
            }
        }

        this.setState(() => ({ color: colorArray }))
    }

    componentDidMount () {
        const { 
            actionBall, actionInvalidBall, actionCountValidRows
        } = this.props

        this.updateColor()

        let AddCircles = () => {
            setTimeout(AddCircles, this.props.defaultTimeAdd - (this.props.circleSpeed*20))

            if(!this.props.gameStop) {
                let newCircles = []
                for(let i = 0; i < this.props.rows; i++) {
                    let x = (GAME.circleWH*i*2) + (i*10)

                    newCircles.push({
                        x: x, y: -100, color: randomElemArray(GAME.colors),
                        row: i
                    })
                }

                this.setState(prevState => ({ circles: [...prevState.circles, ...newCircles] }))
            }
        }
        AddCircles()

        let Loop = () => {
            setTimeout(Loop, 1000/60) // this.props.defaultTime
            
            let clearCircles = false

            if(!this.props.gameStop) {
                if(this.state.circles.length) {
                    let stateCircles = this.state.circles
                        stateCircles.forEach((item, i) => {
                            item.y += this.props.circleSpeed
    
                            if(item.y+(GAME.circleWH*2) >= this.getHeightScene) {
                                // Проверка на цвет
                                if(this.state.color[item.row] !== item.color) {
                                    actionBall(-1)
                                    actionInvalidBall(-1)

                                    playSound('minusBall')
                                } else {
                                    if(!this.state.validRows[item.row])
                                        this.setState(prevState => ({ validRows: {
                                            ...prevState.validRows,
                                            [item.row]: true
                                        } }))
    
                                    if(Object.values(this.state.validRows).length >= this.props.rows) {
                                        this.setState(() => ({ validRows: {} }))
                                        this.updateColor()
                                        actionCountValidRows(1)

                                        // Если режим не "Бесконечный поток"
                                        if(this.props.gameId != 2) 
                                            clearCircles = true

                                        playSound('rowSuccess')
                                    }

                                    playSound('plusBall')

                                    actionBall(1)
                                }
    
                                stateCircles.splice(i, 1)
                                return
                            }
                        })  
                    
                    this.setState(() => ({ circles: clearCircles ? [] : stateCircles })) 
                }
            }
        }
        Loop()

    }

    showCircle = (x,y, color, i, onPress, border) => {
        let styleBorder = border ? {
            borderWidth: 10,
            borderColor: border
        } : {}

        let { validRowsCount, rows, balls } = this.props 

        return <TouchableHighlight onPress={() => {
            onPress ? onPress() : ''
        }} key={i} style={[{top: y, left: x, backgroundColor: color ? color : '#fff', ...styleBorder},styles.circle]}>
            {border ? <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{ textAlign: 'center', fontSize: 43-(balls.toString().length * 5.5), color: border }}>{balls}</Text>
            </View> : <View></View>}
        </TouchableHighlight>
    }

    getCircleColor (index) {
        const { color } = this.state

        if(color.length === 1) {
            return color[0]
        } else {
            return color[index]
        }
    }

    showTriggerCircles = () => {
        const { rows } = this.props
        let { validRows } = this.state

        let circlesTriggers = []

        for(let i = 0; i < rows; i++) {
            let color = this.getCircleColor(i)

            let isRowValid = validRows[i],
                circleX = (i*GAME.circleWH*2) + (i*10),
                circleComponent = isRowValid ? this.showCircle(circleX, 0, color, i, null, null) : this.showCircle(circleX, 0, null, i, null, color)

            circlesTriggers.push(circleComponent)
        }

        return circlesTriggers
    }

    render () {
        let { circles } = this.state

        return (
            <>
                <View style={[styles.gameScene, {
                    height: this.getHeightScene,
                    width: this.getWidthGameScene
                }]}>
                    {circles.map((item, i) => {
                        return this.showCircle(item.x, item.y, item.color, i, () => {
                            if(this.state.color[item.row] == item.color) {
                                this.props.actionBall(-1)
                                this.props.actionInvalidBall(-1)
                                playSound('minusBall')
                            } 

                            circles.splice(i, 1)
                            this.setState(() => ({ circles }))
                        })
                    })}
                </View>
                <View style={[styles.gameScene, {
                    width: this.getWidthGameScene,
                    height: GAME.circleWH*2,
                    zIndex: 0
                }]}>
                    {this.showTriggerCircles()}
                </View>
            </>
        )
    }
}

export default class MenuScreen extends React.Component {
    state = DEFAULT_STATE_MENU

    constructor (props) {
        super(props)

        /**
         * LVLs - пропорциональные скорости
         */
        this.LVLS = {
            0: FIRST_LVL,
            1: {
                circleSpeed: 6,
                defaultTime: 900
            },
            2: {
                circleSpeed: 8,
                defaultTime: 750
            }
        }
    }

    triggerColorLvl = (autoTrigger = true) => {
        this.setState(prevState => ({ lvlTriggerColored: !prevState.lvlTriggerColored }), () => {
            if(autoTrigger)
                setTimeout(() => this.triggerColorLvl(false), 2000)
        })
    }

    setBalls = index => {
        const { gameEnd, gameId } = this.state

        if(!gameEnd) {
            this.setState(prevState => ({ balls: prevState.balls + index }), () => {
                const { balls, gameTypeTrigger } = this.state
                
                if (balls === 500 && gameId != 2) {
                    this.pauseGame()
                    this.setState(() => ({ gameEnd: true }))
                } else if (balls === -30) {
                    playSound('plusBall')
                }
                
            })
        }

    }

    setInvalidBalls = index => this.setState(prevState => ({ invalidBalls: prevState.invalidBalls + index }))

    setValidRows = index => {
        this.setState(prevState => ({ validRowsCount: prevState.validRowsCount + index }), () => {
            const { validRowsCount, gameTypeTrigger } = this.state

            if(validRowsCount % 3 === 0 && validRowsCount > 0) {
                this.changeLVL(null)
                this.triggerColorLvl()
                gameTypeTrigger()
            }
        })
    }

    toggleMenu = menuKey => {
        let $key = 'modal' + menuKey + 'Visible'

        this.setState(prevState => ({ [$key]: !prevState[$key] }), () => {
            this.pauseGame()
        })
    }

    updateLVL = LVL => {
        let _lvl = this.LVLS[LVL]
            _lvl = _lvl ? _lvl : this.LVLS[2]

        if(_lvl) {
            for(let i in _lvl) {
                this.setState(() => ({
                    [i]: _lvl[i],
                    lvl: LVL
                }))
            }
        }
    }

    updateGameType (gameType) {
        const { maxRows } = this.state

        let gameTypeTrigger = () => {}

        switch(parseInt(gameType)) {
            // 0 - больше шариков
            case 0:
                this.setState(() => ({ 
                    rows: 2
                }))

                gameTypeTrigger = () => {
                    this.setState(prevState => ({
                        rows: prevState.rows + 1 > maxRows ? 2 : prevState.rows + 1,

                        defaultTimeAdd: prevState.defaultTimeAdd - 70
                    }))
                }
            break;

            // 1 - больше скорость
            case 1:
                this.setState(() => ({ 
                    rows: 3
                }))

                gameTypeTrigger = () => {
                    this.setState(prevState => ({
                        rows: prevState.rows + 1 > maxRows ? 2 : prevState.rows + 1,

                        defaultTime: prevState.defaultTime - 40,
                        circleSpeed: prevState.circleSpeed - .4
                    }))
                }
            break;

            // 2 - бесконечный поток
            case 2:
                this.setState(() => ({ 
                    rows: 2,
                    circleSpeed: 5,
                    defaultTimeAdd: 1200
                }))
                
                gameTypeTrigger = () => {
                    this.setState(prevState => ({
                        rows: prevState.rows + 1 > maxRows ? 2 : prevState.rows + 1,

                        defaultTime: prevState.defaultTime - 50,
                        circleSpeed: prevState.circleSpeed - .5
                    }))
                }
            break;
        }

        this.setState(() => ({ gameId: gameType, gameTypeTrigger }))
    }

    changeLVL = lvl => {
        if(lvl) {
            this.setState(() => ({ 
                lvl: lvl > this.state.maxLVL ? this.state.maxLVL : lvl 
            }))
        } else {
            this.setState(prevState => ({ 
                lvl: prevState.lvl+1 > this.state.maxLVL ? 0 : prevState.lvl+1 
            }))
        }
    }

    pauseGame = () => this.setState(prevState => ({ gameStop: !prevState.gameStop }))

    loadGame = () => {
        const { gameId = 0, gameLVL = 0 } = this.props.match.params

        stopAllAudios()
        playSound(gameId, .5, { loop: true })

        this.updateLVL(parseInt(gameLVL))
        this.updateGameType(gameId)
    }

    componentDidMount () {
        this.loadGame()
    }

    newGame = () => {
        let newGameState = DEFAULT_STATE_MENU

        newGameState.gameReRender = true

        this.setState(DEFAULT_STATE_MENU, () => {
            this.setState(() => ({ gameReRender: false }))
            this.loadGame()
        })
    }

    getTextLvl () {
        const { lvl } = this.state

        switch(lvl) {
            case 1:
                return 'Средний'
            break;

            case 2:
                return 'Тяжелый'
            break;

            default:
                return 'Легкий'
            break;
        }
    }

    render() {
        const { rows, balls, lvl, gameStop, modalMenuVisible, validRowsCount, maxLVL,
            defaultTime, defaultTimeAdd, circleSpeed, lvlTriggerColored, invalidBalls, gameId,
            gameReRender
        } = this.state

        if((gameId < 0 || gameId === null) || gameReRender)
            return <AppLoading />

        const textLvl = this.getTextLvl()

        return <View>
            <Modal isVisible={modalMenuVisible}>
                <View style={styles.modal}>
                    <Title text={'Меню'} />

                    <Link onPress={() => {
                        playSound('btn')
                        stopAllAudios()
                    }} to={`/games`}>
                        <Text style={STYLES.btn}>Выбрать игру</Text>
                    </Link> 
                    <TouchableHighlight onPress={() => this.toggleMenu('Menu')}>
                        <Text style={STYLES.btn}>Продолжить игру</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.newGame()}>
                        <Text style={STYLES.btn}>Начать игру</Text>
                    </TouchableHighlight>
                    <Link onPress={() => {
                        playSound('btn')
                        stopAllAudios()
                    }} to="/">
                        <Text style={STYLES.btn}>Выйти в главное меню</Text>
                    </Link> 
                </View>
            </Modal>

            <View style={styles.topMenu}>
                <TouchableHighlight onPress={() => this.toggleMenu('Menu')} style={[styles.menuItem, styles.menuLink]}>
                    <Text style={styles.menuText}>Меню</Text>
                </TouchableHighlight>
                <Text style={[styles.menuItem, styles.menuText]}>Ряды: {validRowsCount}</Text>
                <Text style={[styles.menuItem, styles.menuText]}>Штрафы: {invalidBalls}</Text>
                {/* <TouchableHighlight onPress={() => this.updateLVL(lvl + 1 > maxLVL ? 0 : lvl + 1)} style={[styles.menuItem, styles.menuLink, lvlTriggerColored ? {
                    backgroundColor: 'yellow'
                } : {}]}>
                    <Text style={styles.menuText}>{textLvl}</Text>
                </TouchableHighlight> */}
            </View>

            {/* GameView */}
            {balls < 500 ? 

                balls <= -30 || invalidBalls <= -30 ? 
                    <View>
                        <Text style={styles.end}>Вы проиграли!</Text>
                        <Button title={'Начать заново'} onPress={() => this.newGame()} />
                    </View>
                : <GameScene 
                defaultTime={defaultTime}
                defaultTimeAdd={defaultTimeAdd}
                circleSpeed={circleSpeed}
                gameStop={gameStop} 
                lvl={lvl}
                validRowsCount={validRowsCount}
                gameId={gameId}
                actionCountValidRows={newCount => this.setValidRows(newCount)}
                actionBall={newBall => this.setBalls(newBall)} 
                actionInvalidBall={newBall => this.setInvalidBalls(newBall)}
                balls={balls}
                rows={rows} /> 
                
            : <Text style={styles.end}>Игра успешно завершена! У вас {balls} баллов!</Text>}
        </View>
    }
}

const styles = StyleSheet.create({
    gameScene: {
        overflow: 'hidden',
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        zIndex: 1
    },
    circle: {
        position: 'absolute',
        width: GAME.circleWH*2,
        height: GAME.circleWH*2,
        borderRadius: 50
    },
    menuText: {
        fontSize: 16,
        textAlign: 'center'
    },
    menuItem: {
        width: '33%',
        flex: 1,
        alignItems: 'center',
        paddingVertical: 7
    },
    menuLink: {
        backgroundColor: 'lightblue'
    },
    topMenu: {
        marginTop: 25,
        width: GAME.wv,
        backgroundColor: '#e9e9e9',
        borderBottomColor: 'blue',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 18,
        paddingBottom: 18,
        textAlign: 'center'
    },
    modal: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 30,
        borderRadius: 5
    },
    end: {
        textAlign: 'center',
        paddingTop: 40,
        paddingBottom: 40,
        fontSize: 28
    }
})