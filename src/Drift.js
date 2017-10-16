import React from "react";

/**
 * 🏍 DRIFT A Image Slider
 * Uses unique IDs to help denote slides and keep count.
 */

class Drift extends React.Component {
  static get displayName() {
    return "Drift";
  }

  static get defaultProps() {
    return {
      duration: "0.4s",
      easingFn: "ease-in-out",
      dragMin: 100,
      indexWillUpdate: (prevIndex, nextIndex) => {}
    };
  }

  constructor(props) {
    super(props);
    this.setup();
    this.state = {
      isDragging: false,
      isTransitioning: false,
      index: 0,
      indexLast: 0,
      order: []
    };
  }

  /**
   * Component Life Cycles
   */

  componentDidMount() {
    this.setState({ indexLast: this.indexLastFromKeys });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.indexLast !== this.indexLastFromKeys) {
      this.setState({ indexLast: this.indexLastFromKeys });
    }

    if (this.state.index !== nextState.index) {
      // Notify that index has changed.
      this.props.indexWillUpdate(nextState.index, this.state.index);
      this.setState({
        direction: nextState.index > this.state.index ? 1 : -1,
        isTransitioning: true
      });
      this.container.addEventListener(
        "transitionstart",
        this.handleTransitionStart
      );
      this.container.addEventListener(
        "transitionend",
        this.handleTransitionEnd
      );
    } else if (this.state.direction !== 0) {
      this.setState({ direction: 0 });
    }
  }

  setup() {
    this.keys = [];
    [
      "handleDragMove",
      "handleDragStart",
      "handleDragEnd",
      "handleKeyDown",
      "handleTransitionEnd",
      "handleTransitionStart",
      "propsSlide",
      "propsSlides",
      "propsContainer",
      "goToSlide"
    ].forEach(method => (this[method] = this[method].bind(this)));
  }

  /**
   * Getters
   */

  get indexLastFromKeys() {
    // Get index of last slide.
    return this.keys.length;
  }

  get nextIndex() {
    const { deltaX, index } = this.state;

    if (Math.abs(deltaX) < this.props.dragMin) return index;
    else if (deltaX < 0) return index + 1;
    else if (deltaX > 0) return index - 1;
    else return index;
  }

  get transform() {
    const { index, indexLast, deltaX, isDragging } = this.state;

    const percent = `${(this.state.direction + 1) * -100}%`;
    const sign = deltaX > 0 ? "+" : "-";
    const offset = isDragging ? `${Math.abs(deltaX)}px` : "0px";
    return `translate3d(calc(${percent} ${sign} ${offset}), 0px, 0px)`;
  }

  get duration() {
    return this.state.direction === 0 ? "0s" : this.props.duration;
  }

  /**
   * Handlers
   */

  handleTransitionStart() {
    this.setState({ isTransitioning: true });
    this.container.removeEventListener(
      "transitionend",
      this.handleTransitionStart
    );
  }

  handleTransitionEnd() {
    this.container.removeEventListener(
      "transitionend",
      this.handleTransitionEnd
    );

    const { index, indexLast } = this.state;
    const indexNormal = index % (indexLast + 1);

    const order = this.keys.map((key, keyIndex) => {
      if (keyIndex === indexNormal) {
        return 1;
      } else if (
        keyIndex === indexNormal + 1 ||
        (indexNormal === indexLast && keyIndex === 0)
      ) {
        return 2;
      } else if (
        keyIndex === indexNormal - 1 ||
        (keyIndex === indexLast && indexNormal === 0)
      ) {
        return 0;
      } else {
        return 3;
      }
    });
    this.setState({ isTransitioning: false, order });
  }

  handleKeyDown(event) {
    console.log(this.state.isTransitioning);
    if (this.state.isTransitioning) return;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      this.goToSlide(this.state.index - 1);
    } else if (["ArrowRight", "ArrowDown"].includes(event.key)) {
      this.goToSlide(this.state.index + 1);
    }
  }

  handleDragStart(event) {
    if (this.state.isTransitioning) return;
    event.preventDefault();

    this.setState({
      isDragging: true,
      dragStart: this.getClientPosition(event)
    });
  }

  handleDragMove(event) {
    if (!this.state.isDragging) return;
    if (this.state.isTransitioning) return;
    if (!event.touches) event.preventDefault();

    const { x, y } = this.getClientPosition(event);
    const deltaX = x - this.state.dragStart.x;
    const deltaY = y - this.state.dragStart.y;

    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    this.setState({ deltaX });
  }

  handleDragEnd(event) {
    if (!this.state.isDragging) return;
    if (this.state.isTransitioning) return;

    this.setState({
      deltaX: this.getClientPosition(event).x - this.state.dragStart.x,
      isDragging: false,
      index: this.nextIndex
    });
  }

  /**
   * Calculators.
   */

  getClientPosition(event) {
    const coords = event.touches ? event.touches[0] : event;
    return { x: coords.clientX || 0, y: coords.clientY || 0 };
  }

  /**
   * Props for Drift components.
   */

  propsContainer(style = {}) {
    return {
      ref: node => (this.container = node),
      onMouseDown: this.handleDragStart,
      onMouseMove: this.handleDragMove,
      onMouseUp: this.handleDragEnd,
      onMouseLeave: this.handleDragEnd,
      onTouchStart: this.handleDragStart,
      onTouchMove: this.handleDragMove,
      onTouchEnd: this.handleDragEnd,
      onTouchCancel: this.handleDragEnd,
      onKeyDown: this.handleKeyDown,
      tabIndex: 0,
      style: {
        overflow: "hidden",
        ...style
      }
    };
  }

  propsSlides(style = {}) {
    return {
      role: "region",
      style: {
        transition: `${this.duration} transform ${this.props.easingFn}`,
        transform: this.transform,
        display: "flex",
        ...style
      }
    };
  }

  propsSlide(key, style = {}) {
    if (this.keys.indexOf(key) < 0) {
      // A unique key is needed to count slides.
      this.keys.push(key);
    }

    return {
      role: "list-item",
      "aria-hidden":
        this.keys[this.state.index % (this.state.indexLast + 1)] !== key,
      style: {
        width: "100%",
        flex: "0 0 100%",
        order: this.state.order[this.keys.indexOf(key)],
        ...style
      }
    };
  }

  goToSlide(index) {
    return this.setState({
      index
    });
  }

  render() {
    return this.props.children({
      index: this.state.index,
      indexLast: this.state.indexLast,
      propsContainer: this.propsContainer,
      propsSlide: this.propsSlide,
      propsSlides: this.propsSlides,
      goToSlide: this.goToSlide,
      slideNum: this.state.index % (this.state.indexLast + 1)
    });
  }
}

export default Drift;
