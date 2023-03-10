fs = require('fs')
https = require('https')

const searchNextjsData = (html) => {
  const nextjsData = html.matchAll(
    /<script[^>]+id=[\'"]__NEXT_DATA__[\'"][^>]*>([^<]+)<\/script>/g
  )
  for (const match of nextjsData) {
    const data = JSON.parse(match[1])
    return data
  }
}

const parseParagraphs = (resp) => {
  const data = searchNextjsData(resp)
  const transcriptData = data.props.pageProps.transcriptData
  const paragraphs = transcriptData.translation.paragraphs
  return paragraphs
}

const getVideoInfo = (response) => {
  const data = searchNextjsData(response)
  const videoData = data.props.pageProps.videoData
  const videoURL = JSON.parse(videoData.playerData).resources.h264[0].file
  return {
    title: videoData.title,
    slug: videoData.slug,
    id: videoData.id,
    duration: videoData.duration,
    videoURL,
  }
}

const verifyURL = (url) => {
  const urlRegex = new RegExp(
    '^https?://(?:www.)?ted.com/talks/(?:[^/#?]+)',
    'gi'
  )
  const match = urlRegex.exec(url)
  if (match) {
    return match[0]
  }
  return null
}

function downloadFile(url, destPath) {
  const file = fs.createWriteStream(destPath)
  const request = https.get(url, function (response) {
    response.pipe(file)
  })
  request.on('error', function (err) {
    console.error(`Error downloading ${url}: ${err.message}`)
    fs.unlink(destPath, () => {}) // Delete the file async. (But we don't check the result)
  })
  file.on('finish', function () {
    file.close()
    console.log(`Downloaded ${url} to ${destPath}`)
  })
  file.on('error', function (err) {
    console.error(`Error writing to ${destPath}: ${err.message}`)
    fs.unlink(destPath, () => {}) // Delete the file async. (But we don't check the result)
  })
}

const main = async (url) => {
  const response = await fetch(url)
  const html = await response.text()
  const videoInfo = getVideoInfo(html)
  const transcript = parseParagraphs(html)

  console.log(videoInfo)
  fs.writeFileSync(videoInfo.slug + '.json', JSON.stringify(transcript))
  downloadFile(videoInfo.videoURL, videoInfo.slug + '.mp4')
}

const testUrl =
  'https://www.ted.com/talks/julian_treasure_5_ways_to_listen_better/transcript?language=en'

const arg = process.argv[2]

// Check if a URL was provided
if (!arg) {
  console.error('No URL was provided.')
  console.info('Usage: node download.js <URL>')
  process.exit(1)
} else if (!verifyURL(arg)) {
  console.error('The URL provided is not a valid TED Talk URL.')
  console.info('Example: node download.js', testUrl)
  process.exit(1)
} else {
  const url = verifyURL(arg)
  console.log('URL:', url)
  console.info('Downloading video and transcript...')
  main(url)
}
