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
      dragMax: 100,
      indexDidUpdate: (prevIndex, nextIndex) => {}
    };
  }

  constructor(props) {
    super(props);
    this.setup();
    this.bind();
    this.state = {
      dragging: false,
      index: 0,
      indexLast: 0
    };
  }

  /**
   * Component Life Cycles
   */

  componentDidMount() {
    this.setState({ indexLast: this.indexLastFromKeys });
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillMount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.indexLast !== this.indexLastFromKeys) {
      this.setState({ indexLast: this.indexLastFromKeys });
    }

    if (this.state.index !== prevState.index) {
      // Notify that index has changed.
      this.props.indexDidUpdate(prevState.index, this.state.index);
    }
  }

  bind() {
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.propsSlide = this.propsSlide.bind(this);
    this.propsSlides = this.propsSlides.bind(this);
    this.propsContainer = this.propsContainer.bind(this);

    this.goToSlide = this.goToSlide.bind(this);
  }

  setup() {
    this.keys = [];
    this.dragStart = { x: 0, y: 0 };
    this.dragEnd = { x: 0, y: 0 };
  }

  /**
   * Getters
   */

  get indexLastFromKeys() {
    // Get index of last slide from
    return this.keys.length - 1;
  }

  get swipeDirection() {
    const xDist = this.dragStart.x - this.dragEnd.x;
    const yDist = this.dragStart.y - this.dragEnd.y;
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
    return this.normalizeOffset(this.dragEnd.x - this.dragStart.x);
  }

  get translateX() {
    return this.normalizeTranslateX(
      -100 * this.state.index + (this.state.dragging ? this.state.offset : 0)
    );
  }

  get nextIndex() {
    return this.normalizeIndex(this.state.index + this.swipeDirection);
  }

  get isPastDragThreshold() {
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
    this.dragStart = this.normalizeEvent(event);
    this.setState({ dragging: true });
  }

  handleDragMove(event) {
    this.dragEnd = this.normalizeEvent(event);
    if (this.isPastDragThreshold) {
      event.stopPropagation();
      this.setState({ dragging: false });
    } else {
      this.setState({ offset: this.offset });
    }
  }

  handleDragEnd() {
    this.setState({
      dragging: false,
      index: this.nextIndex
    });
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
      onDragStart: this.handleDragStart,
      onDragOver: this.handleDragMove,
      onDragEnd: this.handleDragEnd,
      onTouchStart: this.handleDragStart,
      onTouchMove: this.handleDragMove,
      onTouchEnd: this.handleDragEnd,
      style: {
        overflow: "hidden",
        ...style
      }
    };
  }

  propsSlides(style = {}) {
    return {
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
