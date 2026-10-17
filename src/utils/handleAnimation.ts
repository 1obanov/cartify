type HandleAnimation = {
  selector: string;
  animationClass: string;
  duration?: number;
};

const handleAnimation = ({
  selector,
  animationClass,
  duration = 800,
}: HandleAnimation) => {
  const element = document.querySelector(selector);

  if (element) {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, duration);
  }
};

export { handleAnimation };
