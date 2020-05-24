import React, { 
  useState, 
  useLayoutEffect, 
  useCallback,
  createContext,
  useMemo,
  useContext,
  useEffect,
  useRef
} from 'react'
import mojs from 'mo-js'
import styles from './index.css'

const initialState = {
  count: 0,
  countTotal: 267,
  isClicked: false
}

// Custom Hook for animaton
const useClapAnimation = ({
  clapEl, 
  clapCountEl, 
  clapCountTotalEl
}) => {

  // Do not write useState(new mojs.Timeline())
  // if not every single time useClapAnimation is called
  // new mojs.Timeline() is involved
  const [animationTimeline, setAnimationTimeline] = useState(() => new mojs.Timeline())
  
  useLayoutEffect(() => {
    if(!clapEl || !clapCountEl || !clapCountTotalEl) return
    const tlDuration = 300
    const scaleButton = new mojs.Html({
      el: clapEl,
      duration: tlDuration,
      // scale from [t=0, 1.3] to [t=300, 1]
      scale: { 1.3 : 1 },
      easing: mojs.easing.ease.out
    })

    const countTotalAnimation = new mojs.Html({
      el: clapCountTotalEl,
      delay: (3 * tlDuration) / 2,
      duration: tlDuration,
      // opacity from [t=delay, 0] to [t=300, 1]
      opacity: { 0 : 1 },
      // move up y axis from [t=delay, y=0] to [t=300, y=-3]
      y: { 0 : -3 }
    })

    const countAnimation = new mojs.Html({
      el: clapCountEl,
      duration: tlDuration,
      opacity: { 0 : 1 },
      y: { 0 : -30 }
    }).then({
      // next animation to fade out
      delay: tlDuration / 2,
      opacity: { 1 : 0 },
      y: -80
    })

    // scale back to 1 before animation start
    if(typeof clapEl === 'string') {
      const clap = document.getElementById('clap')
      clap.style.transform = 'scale(1,1)'
    } else {
      clapEl.style.transform = 'scale(1,1)'
    }

    // particle effect burst
    const triangleBurst = new mojs.Burst({
      parent: clapEl,
      // radius from [t=0, 50] to [t=300, 95]
      radius: { 50 : 95 },
      count: 5,
      angle: 30,
      children: {
        // default is triangle
        shape: 'polygon',
        radius: { 6 : 0 },
        stroke: 'rgba(211,54,0,0.5)',
        strokeWidth: 2,
        // angle of each particle
        angle: 210,
        speed: 0.2,
        delay: 30,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        duration: tlDuration,
      }
    })

    const circleBurst = new mojs.Burst({
      parent: clapEl,
      radius: { 50: 75 },
      angle: 25,
      duration: tlDuration,
      children: {
        shape: 'circle',
        fill: 'rgba(149,165,166,0.5)',
        delay: 30,
        speed: 0.2,
        radius: { 3 : 0 },
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
      }
    })

    const newAnimationTimeline = animationTimeline.add(
      [
        scaleButton, 
        countTotalAnimation,
        countAnimation,
        triangleBurst,
        circleBurst
      ])
    setAnimationTimeline(newAnimationTimeline)
  }, [clapEl, clapCountEl, clapCountTotalEl])

  return animationTimeline;
}

// MediumClapContext lets us pass a value deep into the tree of React components in MediumClap component
const MediumClapContext = createContext()

// Use a Provider to pass the current value to the tree below.
// Any component can read it, no matter how deep it is.
const { Provider } = MediumClapContext

// MediumClap component don’t know their children ahead of time. 
// Use the special children prop to pass children elements directly into MediumClap
const MediumClap = ({ children, onClap }) => {
  const MAXIMUM_USER_CLAP = 50
  const [clapState, setClapState] = useState(initialState)
  const { count, countTotal, isClicked } = clapState
  
  const [{ clapRef, clapCountRef, clapCountTotalRef }, setRefState] = useState({})
  const setRef = useCallback(node => {
    setRefState(prevRefState => ({
      ...prevRefState,
      [node.dataset.refkey]: node
    }))
  }, [])

  const animationTimeline = useClapAnimation({
    clapEl: clapRef, 
    clapCountEl: clapCountRef, 
    clapCountTotalEl: clapCountTotalRef
  })

  // 1. default value is false
  // 1. set to true when MediumClap is rendered
  const componentJustMounted = useRef(false)
  useEffect(() => {
    if(componentJustMounted.current){
      // 3. next time count changes
      console.log('onClap is called')
      onClap && onClap(clapState)
    } else {
      // 2. set to true the first time in useEffect after rendered
      componentJustMounted.current = true
    }
  }, [count])

  const handleClapClick = () => {
    animationTimeline.replay()
    setClapState(prevState => ({
      count: Math.min(prevState.count + 1, MAXIMUM_USER_CLAP),
      countTotal: 
        count < MAXIMUM_USER_CLAP 
          ? prevState.countTotal + 1 
          : prevState.countTotal,
      isClicked: true,
    }))
  }

  // Returns a memoized state.
  const memoizedValue = useMemo(
    () => ({
      ...clapState, 
      setRef
    }), [clapState, setRef]
  )

  return (
    // Accepts a value prop to be passed to consuming components that are descendants of this Provider.
    // MediumClap component don’t know their children ahead of time. 
    // Use the special children prop to pass children elements directly into MediumClap
    <Provider value={memoizedValue}>
      <button 
        ref={setRef} 
        data-refkey="clapRef"
        className={styles.clap} 
        onClick={handleClapClick}
      >
        {children}
      </button>
    </Provider>
  )
}

const ClapIcon = () => {
  // Get prop from MediumClapContext instead from parent MediumClap
  const { isClicked } = useContext(MediumClapContext)
  return (
    <span>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='-549 338 100.1 125'
        className={`${styles.icon} ${isClicked && styles.checked}`}
      >
        <path d='M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z' />
        <path d='M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9' />
      </svg>
    </span>
  )
}

const ClapCount = () => {
  // Get prop from MediumClapContext instead from parent MediumClap
  const { count, setRef } = useContext(MediumClapContext)
  return (
    <span 
      ref={setRef} 
      data-refkey="clapCountRef" 
      className={styles.count}
    >
      + {count}
    </span>
  )
}

const ClapCountTotal = () => {
  // Get prop from MediumClapContext instead from parent MediumClap
  const { countTotal, setRef } = useContext(MediumClapContext)
  return (
    <span 
      ref={setRef} 
      data-refkey="clapCountTotalRef" 
      className={styles.total}
    >
      {countTotal}
    </span>
  )
}

MediumClap.Icon = ClapIcon
MediumClap.Count = ClapCount
MediumClap.Total = ClapCountTotal
// import MediumClap, { Icon, Count, Total } from 'medium-clap'

// MediumClap component don’t know their children ahead of time. 
// Use the special children prop to pass children elements directly into MediumClap
const Usage = () => {
  // expose count, countTotal and isClicked
  const [count, setCount] = useState(0)
  const handleClap = (clapState) => {
    setCount(clapState.count)
  }
    // count = 0
    // !count = true
    // !!count = false
  return (
    <div style={{ width: '100%' }}>
      <MediumClap onClap={handleClap}>
        <MediumClap.Icon />
        <MediumClap.Count />
        <MediumClap.Total />
      </MediumClap>
      {!!count && (
        <div className={styles.info}>{`You have clapped ${count} times`}</div>
      )}
    </div>
  )
}

export default Usage
