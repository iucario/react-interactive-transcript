fs = require('fs')

const searchNextjsData = (html) => {
  const nextjsData = html.matchAll(
    /<script[^>]+id=[\'"]__NEXT_DATA__[\'"][^>]*>([^<]+)<\/script>/g
  )
  for (const match of nextjsData) {
    const data = JSON.parse(match[1])
    return data
  }
}

const testUrl =
  'https://www.ted.com/talks/julian_treasure_5_ways_to_listen_better/transcript?language=en'

const parseParagraphs = async (url) => {
  const resp = await fetch(url)
  const data = searchNextjsData(await resp.text())
  const transcriptData = data.props.pageProps.transcriptData
  const paragraphs = transcriptData.translation.paragraphs
  return paragraphs
}

parseParagraphs(testUrl).then((data) => {
  console.log(data)
  fs.writeFileSync('transcript.json', JSON.stringify(data))
})
