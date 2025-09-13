// get all boards
import fetch from "node-fetch";
import {Board, BoardFeedResource, BoardPinData} from "./types/BoardData.js";
import * as url from "node:url";

export async function getProfileBoards(profileName: string) {
    let url = `https://ca.pinterest.com/resource/BoardsResource/get/?source_url=%2F${profileName}%2F_saved%2F&data=%7B%22options%22%3A%7B%22privacy_filter%22%3A%22all%22%2C%22sort%22%3A%22last_pinned_to%22%2C%22field_set_key%22%3A%22profile_grid_item%22%2C%22filter_stories%22%3Afalse%2C%22username%22%3A%22${profileName}%22%2C%22page_size%22%3A25%2C%22group_by%22%3A%22visibility%22%2C%22include_archived%22%3Atrue%2C%22redux_normalize_feed%22%3Atrue%2C%22filter_all_pins%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1757105217784`;
    let b: Board[] = (await fetch(url, {
        "headers": {
            "accept": "application/json, text/javascript, */*, q=0.01",
            "accept-language": "en-US,en;q=0.7",
            "priority": "u=1, i",
            "screen-dpr": "1.5625",
            "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Brave\";v=\"139\", \"Chromium\";v=\"139\"",
            "sec-ch-ua-full-version-list": "\"Not;A=Brand\";v=\"99.0.0.0\", \"Brave\";v=\"139.0.0.0\", \"Chromium\";v=\"139.0.0.0\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-ch-ua-platform-version": "\"19.0.0\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "x-app-version": "b83c95f",
            "x-b3-flags": "0",
            "x-b3-parentspanid": "55a04647bc1e3668",
            "x-b3-spanid": "6ea1896480f439cf",
            "x-b3-traceid": "55a04647bc1e3668",
            "x-pinterest-appstate": "active",
            "x-pinterest-pws-handler": "www/[username]/_saved.js",
            "x-pinterest-source-url": `/${profileName}/_saved/`,
            "x-requested-with": "XMLHttpRequest",
            "cookie": "csrftoken=60849e0c18ceac5b2ff4c8d2d257dfb6; _b=\"AYzB2WljmmNLcbEaYghTyir6rOUPrdtXc4aav1YZ8+TgBmic0fbJTw/uNfmebSlcDZA=\"; _auth=1; _pinterest_sess=TWc9PSYra001VVc2YjRHQmkxT2NUMkxrZU42VjVuNmltWlNVcXpyMDN2RWRKeW5MbXNzajQ1dlBLbnlIdTN3Qmp2SzZrZ2YwTVlmbmVuRjdYemR6TzNRdzYyUVVOdVBtNTJuZkY0QmM2dDJaS2NyQThNSlRMd2ttWkphQXFvSjdQVExSWXBHYkhwNDcrYUREU2pEMlVWTm5VRTBHd3VPMXJ1WjZMUVBQSjQ4MWFrdmI5c0o1b3hTbVVSM0x3VVloUHJWVEZMQk00REhxTCtNSDNuSDRZVnhsbXVnak5XM2dGMFlBbHFHQTl4ZXlYd2RRa3hRcmtOa3JjRXpsZkNkemtxQTYwdllmV21WUUVzTlB1ZFBkMTNtUSsrM2Y3eXJpQzJOWjlrcU1YUmdPVXB1KzlzVzgrZVBRazBPYzlYMjZYTzdRM1FuQVMxb21XdUJQZjdOUmFheC9Hd1Q1WUJiUzVPNVJFQlY3RkVzSHc3bThlQUo1eXZ4b3ZPMFlqRWFPUjIrUkpycklVY0tpV0pqRWpIZjFKbnd5TXM3VEMxVHprS3JyQ2Mrakp1RmU5bTB3dFJZRDRjMW1XVHorV1BydURuWDVjKytmb0FUUHpoblpiQkdMZ2JpcWN4MEtrT2pWYWZpZThrZjY3MktOdUdwcGdYTDZEcDFrZm5TbTdDSUNyOFdCK21HSzF1WVhqZmNMKzlMRzAzT3h4TXhza2F6VlRmUDhpQjhnU244alEvTGFSZjFYZUZNcWNFOTlGVmxOVGlKLzJ0WkY2QmpPSUZQTFNIQit6NHNmK2E5bURSSC9MZHA4cllOY1lXeUJFYlpqNldQM1JFQitHL2ZudWM3dk9mVnpjMDFsLzNrWVVtWkt5Q29yb2pSTSsyd3NVRUZsL0Q0am1nUGhuVFRoQnFnYkc3bFhzQnFjRlJJRkVFditXNVBmSFhHQVpXR2s5MnNiT0pMNys4L3JsMXBLWXRpdi96UUEyblpTdVRJUUhjaEtSYS83ME1SaDRkUm1KWDZLQlhZZE9jUFo2QzlHM2I0YS9HcHVUTjc5enhuaUN5SkRiN0k5anpIWU5TSVdHRjN6dS9zQUtuSFd6bzZScFd2M1JuTFVaQXA5UXB0bytodWs0M1JXSGVUYlpYYnhWRVpOLzYrUWpIclVKYVB6NlBYY242cElpZUlZNnY3STZ4bzhNeTJIc3BDMXpDWVkwUWhZWUJrRm16QkQ5d3ZDOGhVQTRFcHVwRkJzSE5tRUxTWDNTWXVYdS9vZmYyUUJNazBteWRHNGZYdlluTUpGYjl1bzJxMnZwYUZ3KzIyREJuUUZwMXlEcVUwNXNhTjBqVUtYRUFYSnhiWTB2N2lYUVYvcHo0TEREMk4xTTBFWGlpUWNuM1gwd0F0Z1dGNlRieElZNWJwMW95VFFJL3llNGVENmd6R2tRZmNMdHdRMVVSV3N1TFBBejdVWnVJV1JjcysxWEd0RHQvT1BxSmpnTlVrd3VYZXZnZmwrNExQYk8xMWIycHliSGl1SmwvTGtOc3VBOFVncktBTTNrNGo1QjVmM2N2WFJ6OHNFUUV0UDFFSDZuVlBnNHlOSVdJQ2twUitzQzlMeDg0WStObFcxMGJIQ1BFdWhtUExiMWt1UmMxaTRxNDk5SlVxSWRnaWRnWCs5TVo5Y2wwTmF0T1lsb1grbm9NN0NIWnphUUtNUGR4RXFIWjc3YnhYYXA0VEVGVVFHTnZYTW96d3p3Um5qVWFrQzd4cXZiNTJZaklYQXRtUUVpNmtQYlhhY29PQ1gzVHB2NkxNWFgmSnhFY0VhSmJhb2RMbWVaNUt5Qmwya0xxdk84PQ==; __Secure-s_a=N0tVcVB4dEtKb001UmlIR255NVNRRThmb2ZZTFh5eXcvS1pHc0Q2ckwyekY2bmpYdlJhcjdFbXdpckl6NmY1SmkxQUxFc3FUL3UyUUlGYVd0bFZNYkkyOGZIa21hWnlQcUJ5MC9nQjJzc2pYV092cHQ1SzBHSFBBMTVWZmpQMWNiV2NnUWV1VVJmN1QxRU1jODAvOE85djluVC84WExwaHcvQ3pFdk1yV1BHVFZ0Q20xeFNMSTcxbS9xaWJRcitzNjd3ODlVcDZkTkJMYmMzQytXR2FHNFk0elc5NnRBeVpqdkd0NFNUK0l4L2wybjVYVlNtTkxPby92b1Z6MFdIZ1lWWFpRNXNqb0E2eUxUYXB3ZHFEK2ZyVXJHSlFHOTlBdVR6RWZpenUzaCtFOEJNTi9rV0pJN1FrcEVoWDNXWDk1YkkzZ09hRjV3Rjk5WVoxYzZoc0J4RTBmaE1IcFllMjByUmxCSHJOR1BCQjljRFh0a282MkV6YUh3OTBNengyNzgwN2c2cDJXYi82eGR1RDAydWM1UktNb1hiWUVta2NRVXRXRjdGSlkvb1h5RHB6QlBBaHJTbVh1dGxXQlJRTUdsU2JFWENWeUtVWHlCcVF6UVBZd3BkQllBRmorcWVNR1Y3bmlFdDhINGxvU3ZZTm1jSGJHWGsyUzZqMXRQWEhPS040L2ZoMGVNeVFqc3lCRzZRYk8rdHpSMlhydVJXaEoybnNvemJlR0lldkFnS1FaZ0ZINk1kRDdLQ1F1ZXI4Zng4T1hYR0lpMHJEU2lPc2drNUhXM1BZd1NaMjJ3ODRwRlk4U0hseXBTMUNDNXpJV2FKS0k3U09HQlhFZFRNaENtTytPLzZxQThJek5md0JocGM3V1NBU0k4TEFreGs0aGEzUDFFU3JrbUptR0IwL2FDTk1QVXVaZTBiMmxlSzlmcG9XczlLQXgvbm1xU1hRWmhUdkttanpXYmpHRG5KYzlkWGJNUjI1OTZPUnZQZXlJMkFyeE9VVytJbXZVMEUxQjV0anVVN3JzYzVjWEdDWXI5Y0QwNmd5dHRWaHZ5emVrYzBZU1BpVUhVdVdqb3FTUDR3S1QyT2JJUFR6dXNiVUxFYno0T0MrRVFPcjZicEozSTNsWkhSWFVGYllqYmo3aitaVk9iKzNHdjBzUjdlak5QSVN3bVFxUjdiNGdtUC8rMnlOWjdIcFQxVkNSOUNNWXhoZEdRanBiKzZTT1cwdElOU3BBUE5CYVVVYjFyT3czQjVPMmZ1dU1pbTc0OWp0ZGhtbWJZTDhsd1A0em5xVGV5SXZUanNjb1BLblMwdjhrOUt2SVNpcjB3ND0mSFJKS0gzTmI2aWFJVmxTeHhTV0JRUUlFOTkwPQ==; _routing_id=\"796b891a-801b-4bce-8508-1f4bef6b8964\"; sessionFunnelEventLogged=1",
            "Referer": "https://ca.pinterest.com/"
        },
        "body": null,
        "method": "GET"
    })
        .then(async p => await p.json()).then(json => {
            return (json as BoardFeedResource).resource_response.data as unknown as Board[]
        }));

    // Remove the story element, keep board elements
    b.shift()
    return b;
}

export function getBoardSlug(url: String) {
    return url.split('/', 3).filter(Boolean).pop()!
}