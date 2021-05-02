import React from 'react'
import { Button, Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Modal from 'react-native-modal';
import { Link } from 'react-router-native';
import Title from '../elements/Title';
import { randomElemArray } from '../Functions'
import STYLES from '../Styles'

const FIRST_LVL = {
    defaultTime: 1000, circleSpeed: 3
}
const DEFAULT_STATE_MENU = {
    rows: 4,
    balls: 0,
    lvl: 0,
    maxRows: 4,
    validRowsCount: 0,
    maxLVL: 2,
    gameStop: false,
    modalMenuVisible: false,
    gameEnd: false,

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
    colors: ['green', 'red', 'blue', 'yellow']
}


class GameScene extends React.Component {
    state = {
        circles: [],
        color: randomElemArray(GAME.colors),
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

    updateColor = () => this.setState(() => ({ color: randomElemArray(GAME.colors) }))

    componentDidMount () {
        const { 
            actionBall, actionCountValidRows
        } = this.props

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
            setTimeout(Loop, this.props.defaultTime/60)
            
            let clearCircles = false

            if(!this.props.gameStop) {
                if(this.state.circles.length) {
                    let stateCircles = this.state.circles
                        stateCircles.forEach((item, i) => {
                            item.y += this.props.circleSpeed
    
                            if(item.y+(GAME.circleWH*2) >= this.getHeightScene) {
                                // Проверка на цвет
                                if(item.color !== this.state.color) {
                                    actionBall(-1)
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

                                        clearCircles = true
                                    }

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

        return <TouchableHighlight onPress={() => {
            onPress ? onPress() : ''
        }} key={i} style={[{top: y, left: x, backgroundColor: color ? color : '#fff', ...styleBorder},styles.circle]}>
            <View></View>
        </TouchableHighlight>
    }

    showTriggerCircles = () => {
        const { rows } = this.props
        const { color, validRows } = this.state

        let circlesTriggers = []

        for(let i = 0; i < rows; i++) {
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
                            if(item.color !== this.state.color) {
                                circles.splice(i, 1)
                                this.setState(() => ({ circles }))
                            }
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
                circleSpeed: 6,
                defaultTime: 800
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
        const { gameEnd } = this.state

        if(!gameEnd) {
            this.setState(prevState => ({ balls: prevState.balls + index }), () => {
                const { balls, gameTypeTrigger } = this.state
    
                
                if(balls === 50) {
                    this.changeLVL(1)
                    this.triggerColorLvl()
                    gameTypeTrigger()
                } else if (balls === 100) {
                    this.changeLVL(2)
                    this.triggerColorLvl()
                    gameTypeTrigger()
                } else if (balls === 150) {
                    this.pauseGame()
                    this.setState(() => ({ gameEnd: true }))
                }
                
            })
        }

    }

    setValidRows = index => this.setState(prevState => ({ validRowsCount: prevState.validRowsCount + index }))

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
                gameTypeTrigger = () => {
                    this.setState(prevState => ({
                        defaultTimeAdd: prevState.defaultTimeAdd - 100
                    }))
                }
            break;

            // 1 - больше скорость
            case 1:
                gameTypeTrigger = () => {
                    this.setState(prevState => ({
                        defaultTime: prevState.defaultTime - 50,
                        circleSpeed: prevState.circleSpeed - .5
                    }))
                }
            break;

            // 2 - больше рядов
            case 2:
                this.setState(() => ({ 
                    rows: 2,
                    circleSpeed: 5,
                    defaultTime: 800,
                    defaultTimeAdd: 1000
                }))
                
                gameTypeTrigger = () => {
                    this.setState(prevState => ({
                        rows: prevState.rows + 1 > maxRows ? maxRows : prevState.rows + 1
                    }))
                }
            break;
        }

        this.setState(() => ({ gameTypeTrigger }))
    }

    changeLVL = lvl => this.setState(() => ({ lvl: lvl > this.state.maxLVL ? this.state.maxLVL : lvl }))

    pauseGame = () => this.setState(prevState => ({ gameStop: !prevState.gameStop }))

    componentDidMount () {
        const { gameId = 0, gameLVL = 0 } = this.props.match.params

        this.updateLVL(parseInt(gameLVL))
        this.updateGameType(gameId)
    }

    render() {
        const { rows, balls, lvl, gameStop, modalMenuVisible, validRowsCount, maxLVL,
            defaultTime, defaultTimeAdd, circleSpeed, lvlTriggerColored
        } = this.state

        return <View>
            <Modal isVisible={modalMenuVisible}>
                <View style={styles.modal}>
                    <Title text={'Меню'} />

                    <Link to={`/games`}>
                        <Text style={STYLES.btn}>Выбор новой игры</Text>
                    </Link> 
                    <TouchableHighlight onPress={() => this.toggleMenu('Menu')}>
                        <Text style={STYLES.btn}>Продолжить игру</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.setState(DEFAULT_STATE_MENU)}>
                        <Text style={STYLES.btn}>Начать с начала</Text>
                    </TouchableHighlight>
                    <Link to="/">
                        <Text style={STYLES.btn}>Выйти в главное меню</Text>
                    </Link> 
                </View>
            </Modal>

            <View style={styles.topMenu}>
                <TouchableHighlight onPress={() => this.toggleMenu('Menu')} style={[styles.menuItem, styles.menuLink]}>
                    <Text style={styles.menuText}>Меню</Text>
                </TouchableHighlight>
                <Text style={[styles.menuItem, styles.menuText]}>{balls} баллов</Text>
                <TouchableHighlight onPress={() => this.updateLVL(lvl + 1 > maxLVL ? 0 : lvl + 1)} style={[styles.menuItem, styles.menuLink, lvlTriggerColored ? {
                    backgroundColor: 'yellow'
                } : {}]}>
                    <Text style={styles.menuText}>Уровень {lvl+1}</Text>
                </TouchableHighlight>
            </View>

            {/* GameView */}
            {balls < 150 ? 

                balls <= -30 ? 
                    <View>
                        <Text style={styles.end}>Вы проиграли!</Text>
                        <Button title={'Начать заново'} onPress={() => this.setState(DEFAULT_STATE_MENU)} />
                    </View>
                : <GameScene 
                defaultTime={defaultTime}
                defaultTimeAdd={defaultTimeAdd}
                circleSpeed={circleSpeed}
                gameStop={gameStop} 
                lvl={lvl}
                actionCountValidRows={newCount => this.setValidRows(newCount)}
                actionBall={newBall => this.setBalls(newBall)} 
                rows={rows} /> 
                
            : <Text style={styles.end}>Игра успешно завершена! У вас {balls} баллов!</Text>}

            <View style={[styles.topMenu, {
                marginTop: 0
            }]}>
                <Link to="/games" style={styles.menuItem}>
                    <Text style={styles.menuText}>Режим</Text>
                </Link>
                
                <TouchableHighlight style={[styles.menuItem, styles.menuLink]} onPress={this.pauseGame}>
                    <Text style={styles.menuText}>{gameStop ? 'Старт' : 'Пауза'}</Text>
                </TouchableHighlight>
                
                <Text style={[styles.menuItem, styles.menuText]}>{validRowsCount} рядов</Text>
            </View>
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
        fontSize: 18,
        textAlign: 'center'
    },
    menuItem: {
        width: '33%',
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6
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