function ModeChange () {
    cbit_小车类.CarCtrl(cbit_小车类.CarState.Car_Stop)
    RunStatus = STOP
    MoveMode = STOP
    Mode += 1
    if (Mode == CLIFF) {
        basic.showString("C")
    } else if (Mode == ULTRASONIC) {
        basic.showString("U")
    } else if (Mode == TRACK) {
        basic.showString("T")
    } else {
        Mode = IR
        basic.showString("I")
    }
}
function BeepBeep () {
	
}
function RunInCliff () {
    if (cbit_小车类.Line_Sensor(cbit_小车类.enPos.LeftState, cbit_小车类.enLineState.White) && cbit_小车类.Line_Sensor(cbit_小车类.enPos.RightState, cbit_小车类.enLineState.White)) {
        GoForward()
    } else if (cbit_小车类.Line_Sensor(cbit_小车类.enPos.LeftState, cbit_小车类.enLineState.Black) && cbit_小车类.Line_Sensor(cbit_小车类.enPos.RightState, cbit_小车类.enLineState.White)) {
        GoBackward()
        TurnRight()
    } else if (cbit_小车类.Line_Sensor(cbit_小车类.enPos.LeftState, cbit_小车类.enLineState.White) && cbit_小车类.Line_Sensor(cbit_小车类.enPos.RightState, cbit_小车类.enLineState.Black)) {
        GoBackward()
        TurnLeft()
    } else {
        GoBackward()
        if (randint(0, 1) == 0) {
            TurnLeft()
        } else {
            TurnRight()
        }
    }
}
function TurnLeft () {
    cbit_小车类.CarCtrlSpeed(cbit_小车类.CarState.Car_Left, SpeedTurn)
    MoveMode = MOVE_LT
    basic.pause(500)
}
function RunOnTrack () {
    if (cbit_小车类.Line_Sensor(cbit_小车类.enPos.LeftState, cbit_小车类.enLineState.Black) && cbit_小车类.Line_Sensor(cbit_小车类.enPos.RightState, cbit_小车类.enLineState.Black)) {
        GoForward()
    } else if (cbit_小车类.Line_Sensor(cbit_小车类.enPos.LeftState, cbit_小车类.enLineState.Black) && cbit_小车类.Line_Sensor(cbit_小车类.enPos.RightState, cbit_小车类.enLineState.White)) {
        cbit_小车类.CarCtrlSpeed(cbit_小车类.CarState.Car_Left, SpeedTurn)
        MoveMode = MOVE_LT
    } else if (cbit_小车类.Line_Sensor(cbit_小车类.enPos.LeftState, cbit_小车类.enLineState.White) && cbit_小车类.Line_Sensor(cbit_小车类.enPos.RightState, cbit_小车类.enLineState.Black)) {
        cbit_小车类.CarCtrlSpeed(cbit_小车类.CarState.Car_Right, SpeedTurn)
        MoveMode = MOVE_BACK
    } else {
        cbit_小车类.CarCtrlSpeed(cbit_小车类.CarState.Car_Back, SpeedBack)
        MoveMode = MOVE_RIGHT
    }
}
function GoForward () {
    cbit_小车类.AloneCtrlSpeed(cbit_小车类.AloneState.Right_Z_Motor, SpeedFwd)
    cbit_小车类.AloneCtrlSpeed(cbit_小车类.AloneState.Left_Z_Motor, SpeedFwd + Offset)
    MoveMode = MOVE_FWD
}
input.onButtonPressed(Button.A, function () {
    ModeChange()
})
function ToggleRunStop () {
    if (RunStatus == STOP) {
        RunStatus = RUN
    } else {
        RunStatus = STOP
        MoveMode = STOP
        cbit_小车类.CarCtrl(cbit_小车类.CarState.Car_Stop)
    }
}
input.onButtonPressed(Button.B, function () {
    ToggleRunStop()
})
function RunByUltraSonic () {
    if (cbit_小车类.Ultrasonic_Car() > DISTANCE_MIN) {
        GoForward()
    } else {
        Loop = RUN
        while (Loop == RUN) {
            cbit_小车类.CarCtrl(cbit_小车类.CarState.Car_Stop)
            cbit_小车类.Servo_Car(cbit_小车类.enServo.S1, 135)
            basic.pause(1000)
            Distance_R = cbit_小车类.Ultrasonic_Car()
            cbit_小车类.Servo_Car(cbit_小车类.enServo.S1, 55)
            basic.pause(1000)
            Distance_L = cbit_小车类.Ultrasonic_Car()
            cbit_小车类.Servo_Car(cbit_小车类.enServo.S1, 95)
            basic.pause(1000)
            Loop = STOP
            if (Distance_L > DISTANCE_MIN && Distance_R <= DISTANCE_MIN) {
                TurnLeft()
            } else if (Distance_L <= DISTANCE_MIN && Distance_R > DISTANCE_MIN) {
                TurnRight()
            } else if (Distance_L > DISTANCE_MIN && Distance_R > DISTANCE_MIN) {
                if (Distance_L > Distance_R) {
                    TurnLeft()
                } else {
                    TurnRight()
                }
            } else {
                Loop = RUN
                GoBackward()
            }
        }
    }
}
function GoBackward () {
    cbit_小车类.CarCtrlSpeed(cbit_小车类.CarState.Car_Back, SpeedBack)
    MoveMode = MOVE_BACK
    basic.pause(1000)
}
function TurnRight () {
    cbit_小车类.CarCtrlSpeed(cbit_小车类.CarState.Car_Right, SpeedTurn)
    MoveMode = MOVE_RIGHT
    basic.pause(500)
}
function RunByIR () {
    if (cbit_传感器类.IR_Sensor(DigitalPin.P12, cbit_传感器类.enIR.NoGet) && cbit_传感器类.IR_Sensor(DigitalPin.P13, cbit_传感器类.enIR.NoGet)) {
        GoForward()
    } else if (cbit_传感器类.IR_Sensor(DigitalPin.P12, cbit_传感器类.enIR.Get) && cbit_传感器类.IR_Sensor(DigitalPin.P13, cbit_传感器类.enIR.NoGet)) {
        TurnLeft()
    } else if (cbit_传感器类.IR_Sensor(DigitalPin.P12, cbit_传感器类.enIR.NoGet) && cbit_传感器类.IR_Sensor(DigitalPin.P13, cbit_传感器类.enIR.Get)) {
        TurnRight()
    } else {
        GoBackward()
    }
}
let Distance_L = 0
let Distance_R = 0
let Loop = 0
let DISTANCE_MIN = 0
let SpeedTurn = 0
let SpeedBack = 0
let SpeedFwd = 0
let MoveMode = 0
let MOVE_RIGHT = 0
let MOVE_LT = 0
let MOVE_BACK = 0
let MOVE_FWD = 0
let Mode = 0
let IR = 0
let ULTRASONIC = 0
let TRACK = 0
let CLIFF = 0
let RunStatus = 0
let RUN = 0
let STOP = 0
let Offset = 0
cbit_小车类.Servo_Car(cbit_小车类.enServo.S1, 95)
Offset = 30
STOP = 0
RUN = 1
RunStatus = STOP
CLIFF = 4
TRACK = 3
ULTRASONIC = 2
IR = 1
Mode = IR
MOVE_FWD = 1
MOVE_BACK = 2
MOVE_LT = 3
MOVE_RIGHT = 4
MoveMode = STOP
SpeedFwd = 100
SpeedBack = 100
SpeedTurn = 150
DISTANCE_MIN = 15
cbit_小车类.CarCtrl(cbit_小车类.CarState.Car_Stop)
makerbit.connectLcd(39)
makerbit.setLcdBacklight(LcdBacklight.On)
makerbit.showStringOnLcd1602("IR+US+Track+Cliff", makerbit.position1602(LcdPosition1602.Pos1), 16)
basic.showString("I")
cbit_小车类.RGB_Car_Program().setPixelColor(0, neopixel.colors(NeoPixelColors.White))
cbit_小车类.RGB_Car_Program().setPixelColor(1, neopixel.colors(NeoPixelColors.White))
basic.forever(function () {
    if (RunStatus == STOP) {
        cbit_小车类.CarCtrl(cbit_小车类.CarState.Car_Stop)
    } else if (Mode == ULTRASONIC) {
        RunByUltraSonic()
    } else if (Mode == CLIFF) {
        RunInCliff()
    } else if (Mode == TRACK) {
        RunOnTrack()
    } else if (Mode == IR) {
        RunByIR()
    }
})
basic.forever(function () {
    if (MoveMode == MOVE_BACK) {
        BeepBeep()
    }
})
basic.forever(function () {
    if (MoveMode == STOP) {
        cbit_小车类.RGB_Car_Big2(cbit_小车类.enColor.Red)
    } else {
        cbit_小车类.RGB_Car_Big(randint(0, 255), randint(0, 255), randint(0, 255))
        basic.pause(100)
    }
})
