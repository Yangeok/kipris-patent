import playwright from 'playwright'
import cliProgress from 'cli-progress'

export async function getPlaywright () {
  const browser = await playwright.chromium.launch({
    headless: false
  })
  const context = await browser.newContext()
  const page = await context.newPage()
  
  return { page }
}

export function getProgressBar () {
  const barl = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey)
  
  return barl
}