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
      dragMax: 50,
      indexWillUpdate: (prevIndex, nextIndex) => {}
    };
  }

  constructor(props) {
    super(props);
    this.setup();
    this.bind();
    this.state = {
      isDragging: false,
      isSliding: false,
      index: 0,
      indexLast: 0,
      width: 1
    };
  }

  /**
   * Component Life Cycles
   */

  componentDidMount() {
    this.setState({ indexLast: this.indexLastFromKeys });

    const { container } = this;
    if (!this.container) return;
    container.addEventListener("transition", this.handleTransitionStart);
    container.addEventListener("transitionend", this.handleTransitionEnd);
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnMount() {
    const { container } = this;
    container.removeEventListener("transition", this.handleTransitionStart);
    container.removeEventListener("transitionend", this.handleTransitionEnd);
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.indexLast !== this.indexLastFromKeys) {
      this.setState({ indexLast: this.indexLastFromKeys });
    }

    if (this.state.index !== nextState.index) {
      // Notify that index has changed.
      this.props.indexWillUpdate(nextState.index, this.state.index);
    }

    if (
      this.isPastDragThreshold &&
      !this.state.isDragging &&
      !this.state.isSliding
    ) {
      console.log("Updating!");
      this.setState({
        index: this.nextIndex,
        dragEnd: this.state.dragStart
      });
    }
  }

  bind() {
    [
      "handleDragMove",
      "handleDragStart",
      "handleDragEnd",
      "handleKeyDown",
      "handleTransitionStart",
      "handleTransitionEnd",
      "handleResize",
      "propsSlide",
      "propsSlides",
      "propsContainer",
      "goToSlide"
    ].forEach(method => (this[method] = this[method].bind(this)));
  }

  setup() {
    this.keys = [];
  }

  handleTransitionStart() {
    return this.setState({ isSliding: true });
  }

  handleTransitionEnd() {
    return this.setState({ isSliding: false });
  }

  handleResize() {
    return this.setState({ width: this.container.offsetWidth });
  }

  /**
   * Getters
   */

  get resetCoords() {
    return {
      dragStart: {
        x: 0,
        y: 0
      },
      dragEnd: {
        x: 0,
        y: 0
      }
    };
  }

  get indexLastFromKeys() {
    // Get index of last slide.
    return this.keys.length - 1;
  }

  get swipeDirection() {
    const xDist = this.state.dragStart.x - this.state.dragEnd.x;
    const yDist = this.state.dragStart.y - this.state.dragEnd.y;
    const r = Math.atan2(yDist, xDist);

    const angle = this.normalizeAngle(Math.round(r * 180 / Math.PI));

    if ((angle <= 45 && angle >= 0) || (angle <= 360 && angle >= 315)) {
      return 1;
    } else if (angle >= 135 && angle <= 225) {
      return -1;
    } else {
      return 0;
    }
  }

  get offset() {
    if (!this.state.dragStart || !this.state.dragEnd) return 0;
    const offset = this.state.dragEnd.x - this.state.dragStart.x;
    if(offset > this.props)
  }

  get translateX() {
    console.log(this.state.isDragging);
    return this.normalizeTranslateX(
      -100 * this.state.index + (this.state.isDragging ? this.offset : 0)
    );
  }

  get nextIndex() {
    console.log("nextIndex", this.swipeDirection);
    return this.normalizeIndex(this.state.index + this.swipeDirection);
  }

  get isPastDragThreshold() {
    console.log(this.offset, this.state.dragStart, this.state.dragEnd);
    return Math.abs(this.offset) > this.props.dragMax;
  }

  /**
   * Handlers
   */

  handleKeyDown(evt) {
    if (evt.keyCode === 37) {
      this.goToSlide(this.state.index - 1);
    } else if (evt.keyCode === 39) {
      this.goToSlide(this.state.index + 1);
    }
  }

  handleDragStart(event) {
    event.preventDefault();
    this.setState({
      isDragging: true,
      dragStart: this.normalizeEvent(event),
      dragEnd: this.normalizeEvent(event)
    });
  }

  handleDragMove(event) {
    if (!this.state.isDragging) return;

    if (!event.touches) event.preventDefault();

    //if (this.isPastDragThreshold) {
    //this.setState({ isDragging: false, dragEnd: this.normalizeEvent(event) });
    //} else {
    this.setState({ dragEnd: this.normalizeEvent(event) });
    //}
  }

  handleDragEnd() {
    this.setState({ isDragging: false });
  }

  /**
   * Normalizers.
   */

  normalizeEvent(event) {
    const coords = event.touches ? event.touches[0] : event;
    return { x: coords.pageX || 0, y: coords.pageY || 0 };
  }

  normalizeIndex(index) {
    return Math.max(0, Math.min(this.state.indexLast, index));
  }

  normalizeAngle(angle) {
    return 360 - Math.abs(angle);
  }

  normalizeTranslateX(x) {
    return Math.max(-100 * this.state.indexLast, Math.min(0, x));
  }

  normalizeOffset(offset) {
    return Math.max(-100, Math.min(100, offset));
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
      style: {
        overflow: "hidden",
        ...style
      }
    };
  }

  propsSlides(style = {}) {
    return {
      role: "list",
      style: {
        transition: `${this.props.duration} transform ${this.props.easingFn}`,
        transform: `translateX(${this.translateX}%)`,
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
      "aria-hidden": this.keys[this.state.index] !== key,
      style: {
        width: "100%",
        flex: "0 0 100%",
        ...style
      }
    };
  }

  goToSlide(index) {
    return this.setState({
      index: this.normalizeIndex(index)
    });
  }

  render() {
    return this.props.children({
      index: this.state.index,
      indexLast: this.state.indexLast,
      propsContainer: this.propsContainer,
      propsSlide: this.propsSlide,
      propsSlides: this.propsSlides,
      goToSlide: this.goToSlide
    });
  }
}

export default Drift;
