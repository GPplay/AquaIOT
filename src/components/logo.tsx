export default function Logo() {
  return (
    <div className="flex items-center justify-center bg-primary text-primary-foreground h-12 w-12 rounded-full shadow-inner">
      <svg
        className="h-7 w-7"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M62.5 37.5H25L37.5 25L50 37.5H43.75V43.75H50V37.5H62.5ZM50 50L37.5 62.5H25V50H31.25V43.75H25V37.5H31.25V31.25H37.5V25L50 12.5L62.5 25V31.25H68.75V37.5H75V50H68.75V62.5H50V50Z"
          fill="#4781A6"
        />
        <path
          d="M50 50V62.5H68.75V50H50Z"
          fill="#A3D5FF"
        />
        <path
          d="M78.125 37.5C78.125 51.6875 68.75 62.5 68.75 62.5C68.75 62.5 59.375 51.6875 59.375 37.5C59.375 29.3125 67.5 25 78.125 37.5Z"
          fill="#4781A6"
        />
        <path
          d="M18.75 68.75C25 68.75 25 75 31.25 75C37.5 75 37.5 68.75 43.75 68.75C50 68.75 50 75 56.25 75C62.5 75 62.5 68.75 68.75 68.75C75 68.75 75 75 81.25 75C87.5 75 87.5 68.75 93.75 68.75"
          stroke="#4781A6"
          strokeWidth="6.25"
          strokeLinecap="round"
        />
        <path
          d="M6.25 81.25C12.5 81.25 12.5 87.5 18.75 87.5C25 87.5 25 81.25 31.25 81.25C37.5 81.25 37.5 87.5 43.75 87.5C50 87.5 50 81.25 56.25 81.25C62.5 81.25 62.5 87.5 68.75 87.5C75 87.5 75 81.25 81.25 81.25"
          stroke="#4781A6"
          strokeWidth="6.25"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
