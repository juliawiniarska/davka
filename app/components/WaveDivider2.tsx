type Props = {
  flip?: boolean
  top?: string
  bottom?: string
  className?: string
  heightClass?: string
}

export default function WaveDivider2({
  flip,
  top = 'fill-coffeeTan',
  bottom = 'fill-coffeeBeige',
  className = '',
  heightClass = 'h-[clamp(40px,8vw,128px)]',
}: Props) {
  return (
    <div className={`overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className={`block w-full ${heightClass}`}
      >
        <path
          d="M0,192 C240,160 480,224 720,192 C960,160 1200,96 1440,128 L1440,320 L0,320 Z"
          className={top}
        />
        <path
          d="M0,256 C240,224 480,288 720,256 C960,224 1200,160 1440,192 L1440,320 L0,320 Z"
          className={bottom}
        />
      </svg>
    </div>
  )
}
