import axios from 'axios'
export function getOriginalTexts(article_id) {
  return axios({
    method: 'GET',
    url: `/api/reading/article/${article_id}/original`,
  })
}