type Props = {
  flip?: boolean
  color?: string
  className?: string
}

export default function WaveDivider({
  flip,
  color = 'fill-coffeeDark',
  className = '',
}: Props) {
  return (
    <div className={`overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="block w-full h-32"
      >
        <path
          d="
            M0,192
            C240,160 480,224 720,192
            C960,160 1200,96 1440,128
            L1440,320
            L0,320
            Z
          "
          className={color}
        />
      </svg>
    </div>
  )
}
