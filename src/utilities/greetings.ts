export const GREETINGS = [
  'Ciao carusi!',
  'Buongiorno, carusi!',
  'Ehi carusi, vento in poppa!',
  'E allora?',
  'E quindi?',
  'Lo sentite questo rumore?',
  'I buchi a terra!',
  'Ascolta mbare!',
  'Ma come te lo devo dire?'
]

const EMOTICONS = ['👋', '🙌', '🚀', '🎉', '😎', '🔥', '💥', '🎊', '💣']

export const pickRandomGreeting = (): string => {
  const randomIndex = Math.floor(Math.random() * GREETINGS.length)
  const randomEmojiIndex = Math.floor(Math.random() * EMOTICONS.length)

  return `${EMOTICONS[randomEmojiIndex]} ${GREETINGS[randomIndex]}`
}
