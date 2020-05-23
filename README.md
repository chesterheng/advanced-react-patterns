# The Complete Guide to Advanced React Component Patterns

## Table of Contents

- [The Complete Guide to Advanced React Component Patterns](#the-complete-guide-to-advanced-react-component-patterns)
  - [Table of Contents](#table-of-contents)
  - [**Section 1: Introduction**](#section-1-introduction)
  - [**Section 2: The Medium Clap: Real-world Component for Studying Advanced React Patterns**](#section-2-the-medium-clap-real-world-component-for-studying-advanced-react-patterns)
    - [Why build the medium clap?](#why-build-the-medium-clap)
    - [Building and styling the medium clap](#building-and-styling-the-medium-clap)
    - [Handling user interactivity](#handling-user-interactivity)
    - [Higher order components recap](#higher-order-components-recap)
    - [Beginning to animate the clap](#beginning-to-animate-the-clap)
    - [Creating and updating the animation timeline](#creating-and-updating-the-animation-timeline)
    - [Resolving wrong animated scale](#resolving-wrong-animated-scale)
    - [Animating the total count](#animating-the-total-count)
    - [Animating the clap count](#animating-the-clap-count)
    - [Creating animated bursts!](#creating-animated-bursts)
  - [**Section 3: Custom Hooks: The first Foundational Pattern**](#section-3-custom-hooks-the-first-foundational-pattern)
    - [Building an animation custom hook](#building-an-animation-custom-hook)
    - [Custom hooks and refs](#custom-hooks-and-refs)
    - [When is my hook invoked?](#when-is-my-hook-invoked)
  - [**Section 4: The Compound Components Pattern**](#section-4-the-compound-components-pattern)
    - [Why compound components?](#why-compound-components)
    - [How to implement the pattern](#how-to-implement-the-pattern)
    - [Refactor to Compound components](#refactor-to-compound-components)
  - [**Section 5: Patterns for Crafting Reusable Styles**](#section-5-patterns-for-crafting-reusable-styles)
  - [**Section 6: The Control Props Pattern**](#section-6-the-control-props-pattern)
  - [**Section 7: Custom Hooks: A Deeper Look at the Foundational Pattern**](#section-7-custom-hooks-a-deeper-look-at-the-foundational-pattern)
  - [**Section 8: The Props Collection Pattern**](#section-8-the-props-collection-pattern)
  - [**Section 9: The Props Getters Pattern**](#section-9-the-props-getters-pattern)
  - [**Section 10: The State Initialiser Pattern**](#section-10-the-state-initialiser-pattern)
  - [**Section 11: The State Reducer Pattern**](#section-11-the-state-reducer-pattern)
  - [**Section 12: (Bonus) Classifying the Patterns: How to choose the best API**](#section-12-bonus-classifying-the-patterns-how-to-choose-the-best-api)

## **Section 1: Introduction**

Design Patterns

- Time-tested solution to recurring design problems

Why Advanced React Patterns

- Solve issues related to building **reusable components** using proven solutions
- Development of highly cohesive components with **minimal coupling**
- Better ways to **share logic** between components

**[⬆ back to top](#table-of-contents)**

## **Section 2: The Medium Clap: Real-world Component for Studying Advanced React Patterns**

### Why build the medium clap?

- [How the demo showcase works](https://advanced-react-patterns-ultrasimplified.netlify.app/)

Building and styling the medium clap

1. The default State of the Component - unclicked
2. The Clap Count & Burst Shown
3. The Clap Total count Show

![The default State of the Component - unclicked](01-default-state.jpg)
![The Clap Count & Burst Shown](02-clap-count.jpg)
![The Clap Total count Show](03-clap-total.jpg)

```javascript
<button>
	<ClapIcon />
	<ClapCount />
	<CountTotal />
</button>
```

**[⬆ back to top](#table-of-contents)**

### Building and styling the medium clap

- [Free Icons for Everything - Noun Project](https://thenounproject.com/)
- [SVGOMG - SVGO's Missing GUI](https://jakearchibald.github.io/svgomg/)
- [World's Best SVG Compressor](https://vecta.io/nano)

```javascript
const MediumClap = () => (
	<button>
		<ClapIcon />
		<ClapCount />
		<CountTotal />
	</button>
)

const ClapIcon = ({ isClicked }) => (
	<span>
		<svg> ... </svg>
	</span>
)
const ClapCount = ({ count }) => <span>+ {count}</span>
const CountTotal = ({ countTotal }) => <span>{countTotal}</span>
```

**[⬆ back to top](#table-of-contents)**

### Handling user interactivity

```javascript
const initialState = {
  count: 0,
  countTotal: 267,
  isClicked: false
}

const MediumClap = () => {
  const MAXIMUM_USER_CLAP = 50
  const [clapState, setClapState] = useState(initialState)
  const { count, countTotal, isClicked } = clapState

  const handleClapClick = () => {
    animate()
    setClapState(prevState => ({ ... }))
  }
  return (
    <button onClick={handleClapClick} >
      <ClapIcon isClicked={isClicked}/>
      <ClapCount count={count} />
      <CountTotal countTotal={countTotal} />
    </button>
  )
}

const ClapIcon = ({ isClicked }) => (
  <span>
    <svg className={`${isClicked && styles.checked}`>
    </svg>
  </span>
)
const ClapCount = ({ count }) => <span>+ {count}</span>
const CountTotal = ({ countTotal }) => <span>{countTotal}</span>
```

**[⬆ back to top](#table-of-contents)**

### Higher order components recap

[console.log timestamps in Chrome](https://stackoverflow.com/questions/12008120/console-log-timestamps-in-chrome)

- Console: (...) -> Settings -> Preferences -> Console -> [x] Show timestamps

[Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)

- Component -> HOC -> Component\*
- Component(Logic) -> HOC -> Component\*(Animation +Logic)

```javascript
const withClapAnimation = WrappedComponent => {
  class WithClapAnimation extends Component {
    animate = () => {
      console.log('%c Animate', 'background:yellow; color:black')
    }
    render() {
      return <WrappedComponent {...this.props} animate={this.animate}/>
    }
  }
  return WithClapAnimation
}

const MediumClap = ({ animate }) => {
  const handleClapClick = () => {
    animate()
    setClapState(prevState => ({ ... }))
  }

  return (
    <button
      className={styles.clap}
      onClick={handleClapClick}
    >
      <ClapIcon isClicked={isClicked} />
      <ClapCount count={count} />
      <CountTotal countTotal={countTotal} />
    </button>
  )
}

export default withClapAnimation(MediumClap)
```

**[⬆ back to top](#table-of-contents)**

### Beginning to animate the clap

- [JavaScript Motion Graphics Library](https://mojs.github.io/)

Animation Timeline
| Animation | Element | Property | Delay | Start value (time) | Stop value (time) |
|:--------------------|:----------------|:--------:|:------------------:|:------------------:|:----------------------:|
| scaleButton | #clap | scale | 0 | 1.3 (t=delay) | 1 (t=duration) |
| triangleBurst | #clap | radius | 0 | 50 (t=delay) | 95 (t=duration) |
| circleBurst | #clap | radius | 0 | 50 (t=delay) | 75 (t=duration) |
| countAnimation | #clapCount | opacity | 0 | 0 (t=delay) | 1 (t=duration) |
| countAnimation | #clapCount | opacity | duration / 2 | 1 (t=duration) | 0 (t=duration + delay) |
| countTotalAnimation | #clapCountTotal | opacity | (3 \* duration) / 2 | 0 (t=delay) | 1 (t=duration) |

```javascript
import mojs from 'mo-js'

const withClapAnimation = WrappedComponent => {
  class WithClapAnimation extends Component {
    state = {
      animationTimeline: new mojs.Timeline()
    }
    render() {
      return <WrappedComponent
        {...this.props}
        animationTimeline={this.state.animationTimeline />
    }
  }
  return WithClapAnimation
}

const MediumClap = ({ animationTimeline }) => {
  const handleClapClick = () => {
    animationTimeline.replay()
    setClapState(prevState => ({ ... }))
  }

  return (
    <button
      className={styles.clap}
      onClick={handleClapClick}
    >
      <ClapIcon isClicked={isClicked} />
      <ClapCount count={count} />
      <CountTotal countTotal={countTotal} />
    </button>
  )
}

export default withClapAnimation(MediumClap)
```

**[⬆ back to top](#table-of-contents)**

### Creating and updating the animation timeline

- [CSS Animation Timing Function](https://www.w3schools.com/cssref/css3_pr_animation-timing-function.asp)
- [mo.js Base Easing Functions](https://mojs.github.io/api/easing/base-functions.html)

Animation Timeline
| Animation | Element | Property | Delay | Start value (time) | Stop value (time) |
|:--------------------|:----------------|:--------:|:------------------:|:------------------:|:----------------------:|
| scaleButton | #clap | scale | 0 | 1.3 (t=delay) | 1 (t=duration) |

```javascript
import mojs from 'mo-js'

const withClapAnimation = WrappedComponent => {
  class WithClapAnimation extends Component {
    animationTimeline = new mojs.Timeline()
    state = {
      animationTimeline: this.animationTimeline
    }

    componentDidMount() {
      const scaleButton = new mojs.Html({
        el: "#clap",
        duration: 300,
        scale: { 1.3 : 1 },
        easing: mojs.easing.ease.out
      })
      const newAnimationTimeline =
        this.animationTimeline.add([scaleButton])
      this.setState({ animationTimeline: newAnimationTimeline})
    }

    render() {
      return <WrappedComponent
        {...this.props}
        animationTimeline={this.state.animationTimeline />
    }
  }
  return WithClapAnimation
}

const MediumClap = ({ animationTimeline }) => {
  const handleClapClick = () => {
    animationTimeline.replay()
    setClapState(prevState => ({ ... }))
  }

  return (
    <button
      id="clap"
      className={styles.clap}
      onClick={handleClapClick}
    >
      <ClapIcon isClicked={isClicked} />
      <ClapCount count={count} />
      <CountTotal countTotal={countTotal} />
    </button>
  )
}

export default withClapAnimation(MediumClap)
```

**[⬆ back to top](#table-of-contents)**

### Resolving wrong animated scale

```javascript
import mojs from 'mo-js'

const withClapAnimation = WrappedComponent => {
  class WithClapAnimation extends Component {
    animationTimeline = new mojs.Timeline()
    state = {
      animationTimeline: this.animationTimeline
    }

    componentDidMount() {
      const tlDuration = 300
      const scaleButton = new mojs.Html({
        el: "#clap",
        duration: tlDuration,
        scale: { 1.3 : 1 },
        easing: mojs.easing.ease.out
      })

      // scale back to 1 before animation start
      const clap = document.getElementById('clap')
      clap.style.transform = 'scale(1,1)'

      const newAnimationTimeline =
        this.animationTimeline.add([scaleButton, countTotalAnimation])
      this.setState({ animationTimeline: newAnimationTimeline})
    }

    render() {
      return <WrappedComponent
        {...this.props}
        animationTimeline={this.state.animationTimeline />
    }
  }
  return WithClapAnimation
}

export default withClapAnimation(MediumClap)
```

**[⬆ back to top](#table-of-contents)**

### Animating the total count

Animation Timeline
| Animation | Element | Property | Delay | Start value (time) | Stop value (time) |
|:--------------------|:----------------|:--------:|:------------------:|:------------------:|:----------------------:|
| scaleButton | #clap | scale | 0 | 1.3 (t=delay) | 1 (t=duration) |
| countTotalAnimation | #clapCountTotal | opacity | (3 \* duration) / 2 | 0 (t=delay) | 1 (t=duration) |

```javascript
import mojs from 'mo-js'

const withClapAnimation = WrappedComponent => {
  class WithClapAnimation extends Component {
    animationTimeline = new mojs.Timeline()
    state = {
      animationTimeline: this.animationTimeline
    }

    componentDidMount() {
      const tlDuration = 300
      const scaleButton = new mojs.Html({ ... })
      const clap = document.getElementById('clap')
      clap.style.transform = 'scale(1,1)'

      const countTotalAnimation = new mojs.Html({
        el: "#clapCountTotal",
        delay: (3 * tlDuration) / 2,
        duration: tlDuration,
        // opacity from [t=delay, 0] to [t=300, 1]
        opacity: { 0 : 1 },
        // move up y axis from [t=delay, y=0] to [t=300, y=-3]
        y: { 0 : -3 }
      })

      const newAnimationTimeline =
        this.animationTimeline.add([scaleButton, countTotalAnimation])
      this.setState({ animationTimeline: newAnimationTimeline})
    }

    render() {
      return <WrappedComponent
        {...this.props}
        animationTimeline={this.state.animationTimeline />
    }
  }
  return WithClapAnimation
}

const CountTotal = ({ countTotal }) => (
  <span id="clapCountTotal" className={styles.total}>
    {countTotal}
  </span>
)

export default withClapAnimation(MediumClap)
```

**[⬆ back to top](#table-of-contents)**

### Animating the clap count

Animation Timeline
| Animation | Element | Property | Delay | Start value (time) | Stop value (time) |
|:--------------------|:----------------|:--------:|:------------------:|:------------------:|:----------------------:|
| scaleButton | #clap | scale | 0 | 1.3 (t=delay) | 1 (t=duration) |
| countAnimation | #clapCount | opacity | 0 | 0 (t=delay) | 1 (t=duration) |
| countAnimation | #clapCount | opacity | duration / 2 | 1 (t=duration) | 0 (t=duration + delay) |
| countTotalAnimation | #clapCountTotal | opacity | (3 \* duration) / 2 | 0 (t=delay) | 1 (t=duration) |

```javascript
import mojs from 'mo-js'

const withClapAnimation = WrappedComponent => {
  class WithClapAnimation extends Component {
    animationTimeline = new mojs.Timeline()
    state = {
      animationTimeline: this.animationTimeline
    }

    componentDidMount() {
      const tlDuration = 300
      const scaleButton = new mojs.Html({ ... })
      const clap = document.getElementById('clap')
      clap.style.transform = 'scale(1,1)'
      const countTotalAnimation = new mojs.Html({ ... })

      const countAnimation = new mojs.Html({
        el: "#clapCount",
        duration: tlDuration,
        opacity: { 0 : 1 },
        y: { 0 : -30 }
      }).then({
        // next animation to fade out
        delay: tlDuration / 2,
        opacity: { 1 : 0 },
        y: -80
      })

      const newAnimationTimeline =
        this.animationTimeline.add([
          scaleButton,
          countTotalAnimation,
          countAnimation
        ])
      this.setState({ animationTimeline: newAnimationTimeline})
    }

    render() {
      return <WrappedComponent
        {...this.props}
        animationTimeline={this.state.animationTimeline />
    }
  }
  return WithClapAnimation
}

const ClapCount = ({ count }) => (
  <span id="clapCount" className={styles.count}>
    + {count}
  </span>
)

export default withClapAnimation(MediumClap)
```

**[⬆ back to top](#table-of-contents)**

### Creating animated bursts!

[Bezier Generator](https://cubic-bezier.com/#.17,.67,.83,.67)

Animation Timeline
| Animation | Element | Property | Delay | Start value (time) | Stop value (time) |
|:--------------------|:----------------|:--------:|:------------------:|:------------------:|:----------------------:|
| scaleButton | #clap | scale | 0 | 1.3 (t=delay) | 1 (t=duration) |
| triangleBurst | #clap | radius | 0 | 50 (t=delay) | 95 (t=duration) |
| circleBurst | #clap | radius | 0 | 50 (t=delay) | 75 (t=duration) |
| countAnimation | #clapCount | opacity | 0 | 0 (t=delay) | 1 (t=duration) |
| countAnimation | #clapCount | opacity | duration / 2 | 1 (t=duration) | 0 (t=duration + delay) |
| countTotalAnimation | #clapCountTotal | opacity | (3 \* duration) / 2 | 0 (t=delay) | 1 (t=duration) |

```javascript
const withClapAnimation = WrappedComponent => {
  class WithClapAnimation extends Component {
    animationTimeline = new mojs.Timeline()
    state = {
      animationTimeline: this.animationTimeline
    }

    componentDidMount() {
      const tlDuration = 300
      const scaleButton = new mojs.Html({ ... })
      const countTotalAnimation = new mojs.Html({ ... })
      const countAnimation = new mojs.Html({ ... })
      const clap = document.getElementById('clap')
      clap.style.transform = 'scale(1,1)'

      // particle effect burst
      const triangleBurst = new mojs.Burst({
        parent: "#clap",
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
        parent: '#clap',
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

      // update timeline with scaleButton animation
      const newAnimationTimeline =
        this.animationTimeline.add([
          scaleButton,
          countTotalAnimation,
          countAnimation,
          triangleBurst,
          circleBurst
        ])
      this.setState({ animationTimeline: newAnimationTimeline})
    }

    render() {
      return <WrappedComponent
        {...this.props}
        animationTimeline={this.state.animationTimeline} />
    }
  }
  return WithClapAnimation
}
```

**[⬆ back to top](#table-of-contents)**

## **Section 3: Custom Hooks: The first Foundational Pattern**

Custom Hooks are a mechanism to reuse stateful logic

```javascript
// name must start with "use"!
const useAdvancedPatterns = () => {
	// state and effects isolated here
}

// Must be called from a React fn component/other custom hook
useAdvancedPatterns()
```

Open-source examples

- [react-use](https://github.com/streamich/react-use)
- [React Table](https://github.com/tannerlinsley/react-table)

| Pros                          | Cons              |
| :---------------------------- | :---------------- |
| Single Responsibility Modules | Bring your own UI |
| Reduced complexity            |                   |

Pros

- Single Responsibility Modules
  - As seen in react-use, custom hooks are a simple way to share single responsibility modules within React apps.
- Reduced complexity
  - Custom hooks are a good way to reduce complexity in your component library. Focus on logic and let the user bring their own UI e.g. React Table.

Cons

- Bring your own UI
  - Historically, most users expect open-source solutions like React Table to include Table UI elements and props to customize its feel and functionality. Providing only custom hooks may throw off a few users. They may find it harder to compose hooks while providing their own UI.

**[⬆ back to top](#table-of-contents)**

### Building an animation custom hook

[Building Your Own Hooks](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook)

- MediumClap (Logic) -> invoke hook -> useClapAnimation (Animation)
- MediumClap (Logic) <- returns a value <- useClapAnimation (Animation)

```javascript
const initialState = {
  count: 0,
  countTotal: 267,
  isClicked: false
}

// Custom Hook for animaton
const useClapAnimation = () => {

  // Do not write useState(new mojs.Timeline())
  // if not every single time useClapAnimation is called
  // new mojs.Timeline() is involved
  const [animationTimeline, setAnimationTimeline] = useState(() => new mojs.Timeline())

  useEffect(() => {
    const tlDuration = 300
    const scaleButton = new mojs.Html({ ... })
    const countTotalAnimation = new mojs.Html({ ... })
    const countAnimation = new mojs.Html({ ... })
    const clap = document.getElementById('clap')
    clap.style.transform = 'scale(1,1)'
    const triangleBurst = new mojs.Burst({ ... })
    const circleBurst = new mojs.Burst({ ... })
    const newAnimationTimeline = animationTimeline.add(
      [
        scaleButton,
        countTotalAnimation,
        countAnimation,
        triangleBurst,
        circleBurst
      ])
    setAnimationTimeline(newAnimationTimeline)
  }, [])

  return animationTimeline;
}

const MediumClap = () => {
  const MAXIMUM_USER_CLAP = 50
  const [clapState, setClapState] = useState(initialState)
  const { count, countTotal, isClicked } = clapState

  const animationTimeline = useClapAnimation()

  const handleClapClick = () => {
    animationTimeline.replay()
    setClapState(prevState => ({ ... }))
  }

  return (
    <button
      id="clap"
      className={styles.clap}
      onClick={handleClapClick}
    >
      <ClapIcon isClicked={isClicked} />
      <ClapCount count={count} />
      <CountTotal countTotal={countTotal} />
    </button>
  )
}

const ClapIcon = ({ isClicked }) => ( ... )
const ClapCount = ({ count }) => ( ... )
const CountTotal = ({ countTotal }) => ( ... )

export default MediumClap
```

**[⬆ back to top](#table-of-contents)**

### Custom hooks and refs

- [Refs and the DOM](https://reactjs.org/docs/refs-and-the-dom.html)
- [ReactJS — useEffect() & useCallback()](https://medium.com/@infinitypaul/reactjs-useeffect-usecallback-simplified-91e69fb0e7a3)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)

```javascript
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

  useEffect(() => {
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
  }, [])

  return animationTimeline;
}

const MediumClap = () => {
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

  const handleClapClick = () => {
    animationTimeline.replay()
    setClapState(prevState => ({ ... }))
  }

  return (
    <button
      ref={setRef}
      data-refkey="clapRef"
      className={styles.clap}
      onClick={handleClapClick}
    >
      <ClapIcon isClicked={isClicked} />
      <ClapCount count={count} setRef={setRef} />
      <CountTotal countTotal={countTotal} setRef={setRef} />
    </button>
  )
}

const ClapIcon = ({ isClicked }) => ( ... )

const ClapCount = ({ count, setRef }) => (
  <span
    ref={setRef}
    data-refkey="clapCountRef"
    className={styles.count}
  >
    + {count}
  </span>
)

const CountTotal = ({ countTotal, setRef }) => (
  <span
    ref={setRef}
    data-refkey="clapCountTotalRef"
    className={styles.total}
  >
    {countTotal}
  </span>
)

export default MediumClap
```

**[⬆ back to top](#table-of-contents)**

### When is my hook invoked?

- [useEffect vs useLayoutEffect](https://kentcdodds.com/blog/useeffect-vs-uselayouteffect)
- [useEffect vs. useLayoutEffect in plain, approachable language](https://blog.logrocket.com/useeffect-vs-uselayouteffect/)

```javascript
const initialState = { ... }

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
    const scaleButton = new mojs.Html({ ... })
    const countTotalAnimation = new mojs.Html({ ... })
    const countAnimation = new mojs.Html({ ... })

    // scale back to 1 before animation start
    if(typeof clapEl === 'string') {
      const clap = document.getElementById('clap')
      clap.style.transform = 'scale(1,1)'
    } else {
      clapEl.style.transform = 'scale(1,1)'
    }

    // particle effect burst
    const triangleBurst = new mojs.Burst({ ... })
    const circleBurst = new mojs.Burst({ ... })

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

const MediumClap = () => { ... }
const ClapIcon = ({ isClicked }) => ( ... )
const ClapCount = ({ count, setRef }) => ( ... )
const CountTotal = ({ countTotal, setRef }) => ( ... )
export default MediumClap
```

**[⬆ back to top](#table-of-contents)**

## **Section 4: The Compound Components Pattern**

The pattern refers to an interesting way to communicate the relationship between UI components and share implicit state by leveraging an explicit parent-child relationship

Parent Component: MediumClap

- Child Component: Icon
- Child Component: Total
- Child Component: Count

```javascript
// The parent component handles the UI state values and updates. State values are communicated from parent to child
// Typically with the Context API
<MediumClap>
  <MediumClap.Icon />
  <MediumClap.Total />
  <MediumClap.Count />
</MediumClap>

// Adding the child components to the instance of the Parent component is completely optional. The following is equally valid
<MediumClap>
  <ClapIcon />
  <ClapCountTotal />
  <ClapCount />
</MediumClap>
```

Open-source examples

- [Reach UI](https://reacttraining.com/reach-ui/)

| Pros                      | Cons |
| :------------------------ | :--- |
| Flexible Markup Structure |      |
| Reduced complexity        |      |
| Separation of Concerns    |      |

Pros

- Flexible Markup Structure
  - Users can rearrange the child components in whatever way they seem fit. e.g. having an accordion header at the bottom as opposed to the top.
- Reduced Complexity
  - As opposed to jamming all props in one giant parent component and drilling those down to child UI components, child props go to their respective child components.
- Separation of Concerns
  - Having all UI state logic in the Parent component and communicating that internally to all child components makes for a clear division of responsibility.

**[⬆ back to top](#table-of-contents)**

### Why compound components?

- Customizability: can change child component props
- Understandable API: user can see all child components
- Props Overload

```javascript
<MediumClap
  clapProps={}
  countTotalProps={}
  clapIconProps={}
/>

<MediumClap>
  <ClapIcon />
  <ClapCountTotal />
  <ClapCount />
</MediumClap>
```

**[⬆ back to top](#table-of-contents)**

### How to implement the pattern

1. Create a context object to pass values into the tree of child components in parent component
2. Use a Provider to pass the current value to the tree below
3. Returns a memoized state
4. Accepts a value prop to be passed to consuming components that are descendants of this Provider
5. Use the special children prop to pass children elements directly into Parent component
6. Get prop from context object instead from parent prop

Parent Component: MediumClap - use a Provider to pass the current value to the tree below
- Child Component: ClapIcon - get prop from context object
- Child Component: ClapCountTotal - get prop from context object
- Child Component: ClapCount - get prop from context object

```javascript
// 1. Create a context object to pass values into the tree of child components in parent component
const MediumClapContext = createContext()

// 2. Use a Provider to pass the current value to the tree below
const { Provider } = MediumClapContext

// 5. Use the special children prop to pass children elements directly into Parent component
const MediumClap = ({ children }) => {

  // 3. Returns a memoized state.
  const memoizedValue = useMemo( ... )

  return (
    // 4. Accepts a value prop to be passed to consuming components that are descendants of this Provider
    // 5. Use the special children prop to pass children elements directly into Parent component
    <Provider value={memoizedValue}>
      <button>
        {children}
      </button>
    </Provider>
  )
}

// 6. Get prop from context object instead from parent prop
const ClapIcon = () => {
  const { isClicked } = useContext(MediumClapContext)
  return ( ... )
}

// 6. Get prop from context object instead from parent prop
const ClapCount = () => {
  const { count, setRef } = useContext(MediumClapContext)
  return ( ... )
}

// 6. Get prop from context object instead from parent prop
const CountTotal = () => {
  const { countTotal, setRef } = useContext(MediumClapContext)
  return ( ... )
}

// 5. Use the special children prop to pass children elements directly into Parent component
const Usage = () => {
  return (
    <MediumClap>
      <ClapIcon />
      <ClapCount />
      <ClapCountTotal />
    </MediumClap>
  )
}
```

**[⬆ back to top](#table-of-contents)**

### Refactor to Compound components

```javascript
const initialState = {
  count: 0,
  countTotal: 267,
  isClicked: false
}

const useClapAnimation = () => { ... }

// 1. MediumClapContext lets us pass a value deep into the tree of React components in MediumClap component
const MediumClapContext = createContext()

// 2. Use a Provider to pass the current value to the tree below. 
// Any component can read it, no matter how deep it is.
const { Provider } = MediumClapContext

// 5. MediumClap component don’t know their children ahead of time.
// Use the special children prop to pass children elements directly into MediumClap
const MediumClap = ({ children }) => {
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

  const handleClapClick = () => {
    animationTimeline.replay()
    setClapState(prevState => ({ ... }))
  }

  // 3. Returns a memoized state.
  const memoizedValue = useMemo(
    () => ({
      ...clapState,
      setRef
    }), [clapState, setRef]
  )

  return (
    // 4. Accepts a value prop to be passed to consuming components that are descendants of this Provider.
    // 5. MediumClap component don’t know their children ahead of time.
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
  // 6. Get prop from MediumClapContext instead from parent MediumClap
  const { isClicked } = useContext(MediumClapContext)
  return ( ... )
}

const ClapCount = () => {
  // 6. Get prop from MediumClapContext instead from parent MediumClap
  const { count, setRef } = useContext(MediumClapContext)
  return ( ... )
}

const CountTotal = () => {
  // 6. Get prop from MediumClapContext instead from parent MediumClap
  const { countTotal, setRef } = useContext(MediumClapContext)
  return ( ... )
}

// 5. MediumClap component don’t know their children ahead of time.
// Use the special children prop to pass children elements directly into MediumClap
const Usage = () => {
  return (
    <MediumClap>
      <ClapIcon />
      <ClapCount />
      <ClapCountTotal />
    </MediumClap>
  )
}

export default Usage
```

**[⬆ back to top](#table-of-contents)**

## **Section 5: Patterns for Crafting Reusable Styles**

**[⬆ back to top](#table-of-contents)**

## **Section 6: The Control Props Pattern**

**[⬆ back to top](#table-of-contents)**

## **Section 7: Custom Hooks: A Deeper Look at the Foundational Pattern**

**[⬆ back to top](#table-of-contents)**

## **Section 8: The Props Collection Pattern**

**[⬆ back to top](#table-of-contents)**

## **Section 9: The Props Getters Pattern**

**[⬆ back to top](#table-of-contents)**

## **Section 10: The State Initialiser Pattern**

**[⬆ back to top](#table-of-contents)**

## **Section 11: The State Reducer Pattern**

**[⬆ back to top](#table-of-contents)**

## **Section 12: (Bonus) Classifying the Patterns: How to choose the best API**

**[⬆ back to top](#table-of-contents)**

```

```
