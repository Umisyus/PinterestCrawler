import {Board} from "./BoardData";

async function getBoardSectionPins(profileName: string, board: Board, section_id: string, bookmark: string) {
    let headers = {
        // "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0",
            "Accept": "application/json, text/javascript, */*, q=0.01",
            "Accept-Language": "en",
            "X-Requested-With": "XMLHttpRequest",
            "X-APP-VERSION": "4e42856",
            "X-Pinterest-AppState": "active",
            "X-Pinterest-Source-Url": "/dracana96/concept-art/creatures/",
            "X-Pinterest-PWS-Handler": "www/[username]/[slug]/[section_slug].js",
            "screen-dpr": "1",
            "X-B3-TraceId": "1ddec6b8d84d7f25",
            "X-B3-SpanId": "75986f02bf8a5eb5",
            "X-B3-ParentSpanId": "1ddec6b8d84d7f25",
            "X-B3-Flags": "0",
            "Alt-Used": "ca.pinterest.com",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://ca.pinterest.com/",
        "method": "GET",
        // "mode": "cors"
    };

    let input = encodeURIComponent(JSON.stringify({
        "options": {
            "page_size": 25,
            "prepend": false,
            "section_id": section_id,
            "bookmarks": [`${bookmark}`]
        }, "context": {}
    }))

    let resp = await fetch(`https://ca.pinterest.com/resource/BoardSectionPinsResource/get/?source_url=%2F${profileName}%2F${board.name}%2Fcreatures%2F&data=` + input + "&_=1757561989525", headers);
    let json = await resp.json()

    return json.data as BoardSectionResponse[]

}


// //
// const data = {
//     options: {
//         profileName,
//         board_id: board.id,
//         bookmark
//     },
//     context: {}
// };
// // "https://ca.pinterest.com/resource/BoardSectionPinsResource/get/?source_url=%2Fdracana96%2Fconcept-art%2Fcreatures%2F&data=%7B%22options%22%3A%7B%22page_size%22%3A25%2C%22prepend%22%3Afalse%2C%22section_id%22%3A%225240292013187850544%22%2C%22bookmarks%22%3A%5B%22LT42NDY0Nzc3MjE1MTUzMzk2NTN8NDl8NDZ8NzYyMTIzNzI5NDczMTE3OCpHUUwqfGExNTllMjYwNzI3YzlhZDlhYWRlZGMxODA1N2UyOTVjNjM3OTQ0MTVlNmU2YzZmZTMyMzI4N2M0NTcyYmVmYTd8TkVXfA%3D%3D%22%5D%7D%2C%22context%22%3A%7B%7D%7D&_=1757561989525"
//
// const url = `https://ca.pinterest.com/resource/BoardSectionsResource/get/?source_url=/dracana96/concept-art/creatures/&data=${encodeURIComponent(JSON.stringify(data))}`;
// let headers = {
//     "credentials": "include",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0",
//         "Accept": "application/json, text/javascript, */*, q=0.01",
//         "Accept-Language": "en",
//         "X-Requested-With": "XMLHttpRequest",
//         "X-APP-VERSION": "4e42856",
//         "X-Pinterest-AppState": "active",
//         "X-Pinterest-Source-Url": "/dracana96/concept-art/creatures/",
//         "X-Pinterest-PWS-Handler": "www/[username]/[slug]/[section_slug].js",
//         "screen-dpr": "1",
//         "X-B3-TraceId": "1ddec6b8d84d7f25",
//         "X-B3-SpanId": "75986f02bf8a5eb5",
//         "X-B3-ParentSpanId": "1ddec6b8d84d7f25",
//         "X-B3-Flags": "0",
//         "Alt-Used": "ca.pinterest.com",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "same-origin"
//     },
//     "referrer": "https://ca.pinterest.com/",
//     "method": "GET",
//     "mode": "cors"
// };
// // @ts-ignore
// await fetch(url, headers);
// //

async function getBoardSections(board: Board) {
    let options = {
        // "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0",
            "Accept": "application/json, text/javascript, */*, q=0.01",
            "Accept-Language": "en",
            "X-Requested-With": "XMLHttpRequest",
            "X-APP-VERSION": "4e42856",
            "X-Pinterest-AppState": "background",
            "X-Pinterest-Source-Url": "/dracana96/concept-art/",
            "X-Pinterest-PWS-Handler": "www/[username]/[slug].js",
            "screen-dpr": "1",
            "X-B3-TraceId": "0a810140b4ffb0d4",
            "X-B3-SpanId": "67796b20f01c32e4",
            "X-B3-ParentSpanId": "0a810140b4ffb0d4",
            "X-B3-Flags": "0",
            "Alt-Used": "ca.pinterest.com",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=0"
        },
        "referrer": "https://ca.pinterest.com/",
        "method": "GET",
        // "mode": "cors"
    }
    let data = []
    let input = "%7B%22options%22%3A%7B%22board_id%22%3A%22" + board.id + "%22%7D%2C%22context%22%3A%7B%7D%7D";
    let sections = await fetch("https://ca.pinterest.com/resource/BoardSectionsResource/get/?source_url=%2Fdracana96%2Fconcept-art%2F&data=" + input, options);
    data = (sections as unknown as BoardSectionResponse).resource_response.data
    if (data !== undefined) {
        return data
    }
    return []
}

// await fetch("https://ca.pinterest.com/resource/BoardSectionPinsResource/get/?source_url=%2Fdracana96%2Fconcept-art%2Fcreatures%2F&data=%7B%22options%22%3A%7B%22page_size%22%3A25%2C%22prepend%22%3Afalse%2C%22section_id%22%3A%225240292013187850544%22%2C%22bookmarks%22%3A%5B%22LT42NDY0Nzc3MjE1MTUzMzk2NTN8NDl8NDZ8NzYyMTIzNzI5NDczMTE3OCpHUUwqfGExNTllMjYwNzI3YzlhZDlhYWRlZGMxODA1N2UyOTVjNjM3OTQ0MTVlNmU2YzZmZTMyMzI4N2M0NTcyYmVmYTd8TkVXfA%3D%3D%22%5D%7D%2C%22context%22%3A%7B%7D%7D&_=1757561989525", {
//     "credentials": "include",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0",
//         "Accept": "application/json, text/javascript, */*, q=0.01",
//         "Accept-Language": "en",
//         "X-Requested-With": "XMLHttpRequest",
//         "X-APP-VERSION": "4e42856",
//         "X-Pinterest-AppState": "active",
//         "X-Pinterest-Source-Url": "/dracana96/concept-art/creatures/",
//         "X-Pinterest-PWS-Handler": "www/[username]/[slug]/[section_slug].js",
//         "screen-dpr": "1",
//         "X-B3-TraceId": "1ddec6b8d84d7f25",
//         "X-B3-SpanId": "75986f02bf8a5eb5",
//         "X-B3-ParentSpanId": "1ddec6b8d84d7f25",
//         "X-B3-Flags": "0",
//         "Alt-Used": "ca.pinterest.com",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "same-origin"
//     },
//     "referrer": "https://ca.pinterest.com/",
//     "method": "GET",
//     "mode": "cors"
// });
// await fetch("https://ca.pinterest.com/resource/BoardSectionResource/get/?source_url=%2Fdracana96%2Fconcept-art%2Fcreatures%2F&data=%7B%22options%22%3A%7B%22board_slug%22%3A%22concept-art%22%2C%22section_slug%22%3A%22creatures%22%2C%22username%22%3A%22dracana96%22%7D%2C%22context%22%3A%7B%7D%7D&_=1757529394863", {
//     "credentials": "include",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0",
//         "Accept": "application/json, text/javascript, */*, q=0.01",
//         "Accept-Language": "en",
//         "X-Requested-With": "XMLHttpRequest",
//         "X-APP-VERSION": "f1c6631",
//         "X-Pinterest-AppState": "active",
//         "X-Pinterest-Source-Url": "/dracana96/concept-art/creatures/",
//         "X-Pinterest-PWS-Handler": "www/[username]/[slug]/[section_slug].js",
//         "screen-dpr": "1",
//         "X-B3-TraceId": "4c72d90176b21272",
//         "X-B3-SpanId": "492cd0bd1625ebe9",
//         "X-B3-ParentSpanId": "4c72d90176b21272",
//         "X-B3-Flags": "0",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "same-origin"
//     },
//     "referrer": "https://ca.pinterest.com/",
//     "method": "GET",
//     "mode": "cors"
// });


export interface ClientContext {
    analysis_ua: AnalysisUa;
    app_type_detailed: number;
    app_version: string;
    batch_exp: boolean;
    browser_locale: string;
    browser_name: string;
    browser_type: number;
    browser_version: string;
    country: string;
    country_from_hostname: string;
    country_from_ip: string;
    csp_nonce: string;
    current_url: string;
    debug: boolean;
    deep_link: string;
    enabled_advertiser_countries: string[];
    facebook_token: null;
    full_path: string;
    http_referrer: string;
    impersonator_user_id: null;
    invite_code: string;
    invite_sender_id: string;
    is_authenticated: boolean;
    is_bot: string;
    is_full_page: boolean;
    is_mobile_agent: boolean;
    is_sterling_on_steroids: boolean;
    is_tablet_agent: boolean;
    language: string;
    locale: string;
    origin: string;
    path: string;
    placed_experiences: null;
    referrer: null;
    region_from_ip: string;
    request_host: string;
    request_identifier: string;
    social_bot: string;
    stage: string;
    sterling_on_steroids_ldap: null;
    sterling_on_steroids_user_type: null;
    theme: string;
    unauth_id: string;
    seo_debug: boolean;
    user_agent_can_use_native_app: boolean;
    user_agent_platform: string;
    user_agent_platform_version: null;
    user_agent: string;
    user: User;
    utm_campaign: null;
    visible_url: string;
}

export interface AnalysisUa {
    app_type: number;
    app_version: string;
    browser_name: string;
    browser_version: string;
    device_type: null;
    device: string;
    os_name: string;
    os_version: string;
}

export interface User {
    unauth_id: string;
    ip_country: string;
    ip_region: string;
}

export interface Resource {
    name: string;
    options: Options;
}

export interface Options {
    bookmarks: string[];
    board_id: string;
}

// export interface ResourceResponse {
//     status: string;
//     code: number;
//     message: string;
//     endpoint_name: string;
//     data: BoardSection[];
//     x_pinterest_sli_endpoint_name: string;
//     http_status: number;
// }

export interface SectionData {
    node_id: string;
    board: Board;
    preview_pins: PreviewPin[];
    title: string;
    id: string;
    pin_count: number;
    user: Board;
    type: string;
    slug: string;
}

export interface PreviewPin {
    node_id: string;
    title: string;
    image_square_size_pixels: Image;
    tracking_params: TrackingParams;
    id: string;
    comment_count: number;
    is_uploaded: boolean;
    image_medium_size_points: Image;
    is_video: boolean;
    promoter: null;
    image_square_url: string;
    is_playable: boolean;
    image_square_size_points: Image;
    type: Type;
    image_large_size_pixels: Image;
    image_medium_url: string;
    image_large_size_points: Image;
    image_large_url: string;
    is_repin: boolean;
    domain: Domain;
    price_value: number;
    is_downstream_promotion: boolean;
    price_currency: PriceCurrency;
    image_medium_size_pixels: Image;
    repin_count: number;
    created_at: string;
    tracked_link: null | string;
    link: null | string;
    cacheable_id: string;
    description: Description;
    attribution: null;
}

export enum Description {
    EscapeIntoAWorldOfRelaxationAndMusicalBliss = "Escape into a world of relaxation and musical bliss.",
}

export enum Domain {
    InstagramCOM = "instagram.com",
    RedbubbleCOM = "redbubble.com",
    UploadedByUser = "Uploaded by user",
    XCOM = "x.com",
    YoutuBe = "youtu.be",
}

export interface Image {
    width: number;
    height: number;
}

export enum PriceCurrency {
}


export enum Type {
    Pin = "pin",
}

export interface BoardSectionResponse {
    resource_response: ResourceResponse;
    client_context: ClientContext;
    resource: Resource;
    request_identifier: string;
}

export interface AnalysisUa {
    app_type: number;
    app_version: string;
    browser_name: string;
    browser_version: string;
    device_type: null;
    device: string;
    os_name: string;
    os_version: string;
}

export interface User {
    unauth_id: string;
    ip_country: string;
    ip_region: string;
}

export interface Resource {
    name: string;
    options: Options;
}

export interface Options {
    bookmarks: string[];
    page_size: number;
    prepend: boolean;
    section_id: string;
}

export interface ResourceResponse {
    status: string;
    code: number;
    message: string;
    endpoint_name: string;
    data: SectionData[];
    bookmark: string;
    x_pinterest_sli_endpoint_name: string;
    http_status: number;
}

export interface BoardSectionPin {
    node_id: string;
    is_video: boolean;
    grid_description: Description;
    product_metadata: null;
    creator_analytics: null;
    carousel_data: null;
    alt_text: null;
    price_value: number;
    product_pin_data: null;
    embed: null;
    videos: null;
    is_eligible_for_related_products: boolean;
    favorite_user_count: number;
    repin_count: number;
    aggregated_pin_data: AggregatedPinData;
    native_creator: NativeCreator | null;
    pinner: Ner;
    price_currency: PriceCurrency;
    campaign_id: null;
    description: Description;
    promoted_lead_form: null;
    is_whitelisted_for_tried_it: boolean;
    debug_info_html: null;
    comment_count: number;
    is_native: boolean;
    sponsorship: null;
    call_to_action_text: null;
    description_html: Description;
    is_go_linkless: boolean;
    has_required_attribution_provider: boolean;
    created_at: string;
    reaction_counts: { [key: string]: number };
    tracking_params: TrackingParams;
    comments: Comments;
    attribution: null;
    method: string;
    ad_match_reason: number;
    shopping_flags: any[];
    image_signature: string;
    manual_interest_tags: null;
    privacy: Privacy;
    image_crop: ImageCrop;
    story_pin_data_id: null | string;
    is_repin: boolean;
    utm_link: null;
    access: any[];
    digital_media_source_type: number | null;
    type: DatumType;
    favorited_by_me: boolean;
    link_domain: null;
    done_by_me: boolean;
    is_oos_product: boolean;
    insertion_id: null;
    is_promoted: boolean;
    rich_summary: RichSummary | null;
    is_downstream_promotion: boolean;
    grid_title: string;
    auto_alt_text: null | string;
    view_tags: any[];
    is_playable: boolean;
    story_pin_data: StoryPinData | null;
    link: null | string;
    is_stale_product: boolean;
    is_quick_promotable: boolean;
    link_utm_applicable_and_replaced: number;
    dominant_color: string;
    video_status: null;
    video_status_message: null;
    is_uploaded: boolean;
    is_eligible_for_pdp: boolean;
    id: string;
    domain: string;
    promoted_is_removable: boolean;
    images: { [key: string]: Image };
    additional_hide_reasons: any[];
    is_eligible_for_web_closeup: boolean;
    title: string;
    should_open_in_stream: boolean;
    collection_pin: null;
    promoted_is_lead_ad: boolean;
    board: Board;
    promoter: null;
}

export interface AggregatedPinData {
    node_id: string;
    did_it_data: DidItData;
    id: string;
    aggregated_stats: AggregatedStats;
    is_shop_the_look: boolean;
    has_xy_tags: boolean;
    creator_analytics: null;
}

export interface AggregatedStats {
    done: number;
}

export interface DidItData {
    rating: number;
    details_count: number;
    videos_count: number;
    recommend_scores: RecommendScore[];
    recommended_count: number;
    tags: any[];
    images_count: number;
    user_count: number;
    responses_count: number;
}

export interface RecommendScore {
    score: number;
    count: number;
}

export enum Layout {
    Default = "default",
}

export enum Name {
    ConceptArt = "Concept art",
}

export enum BoardNodeID {
    Qm9HcmQ6NjQ2NDc3NzkwMjAwMTg4NDI3 = "Qm9hcmQ6NjQ2NDc3NzkwMjAwMTg4NDI3",
}

export interface Ner {
    node_id: PinnerNodeID;
    image_large_url: string;
    blocked_by_me: boolean;
    username: Username;
    is_verified_merchant: boolean;
    id: string;
    type: PinnerType;
    verified_identity: PinnerVerifiedIdentity;
    explicitly_followed_by_me: boolean;
    is_ads_only_profile: boolean;
    is_primary_website_verified: boolean;
    image_medium_url: string;
    image_small_url: string;
    full_name: FullName;
    ads_only_profile_site: null;
}

export enum FullName {
    Umit = "Umit",
}

export enum PinnerNodeID {
    VXNlcjo2NDY0Nzc4NTg5MTg5MzE1NjU = "VXNlcjo2NDY0Nzc4NTg5MTg5MzE1NjU=",
}

export enum PinnerType {
    User = "user",
}

export enum Username {
    Dracana96 = "dracana96",
}

export interface PinnerVerifiedIdentity {
}

export enum Privacy {
    Public = "public",
}

export enum BoardType {
    Board = "board",
}

export enum URL {
    Dracana96ConceptArt = "/dracana96/concept-art/",
}

export interface Comments {
    uri: string;
    data: any[];
    bookmark: null;
}

export enum Description {
    Empty = " ",
    SpassUndSpiele = "Spass und Spiele",
}

export interface ImageCrop {
    min_y: number;
    max_y: number;
}

export interface Image {
    width: number;
    height: number;
    url: string;
}

export interface NativeCreator {
    node_id: string;
    image_large_url: string;
    blocked_by_me: boolean;
    username: string;
    is_verified_merchant: boolean;
    id: string;
    type: PinnerType;
    verified_identity: NativeCreatorVerifiedIdentity;
    explicitly_followed_by_me: boolean;
    is_ads_only_profile: boolean;
    is_primary_website_verified: boolean;
    image_medium_url: string;
    image_small_url: string;
    full_name: string;
    ads_only_profile_site: null;
}

export interface NativeCreatorVerifiedIdentity {
    verified?: boolean;
}

export enum PriceCurrency {
    Usd = "USD",
}

export interface RichSummary {
    apple_touch_icon_link: null | string;
    type_name: TypeName;
    type: RichSummaryType;
    id: string;
    actions: any[];
    favicon_images: IconImages;
    products: any[];
    url: string;
    display_description: string;
    display_name: string;
    favicon_link: string;
    site_name: string;
    apple_touch_icon_images: IconImages | null;
    is_soft_404?: boolean;
    is_hard_404?: boolean;
}

export interface IconImages {
    orig: string;
    "50x"?: string;
}

export enum RichSummaryType {
    Richpingriddata = "richpingriddata",
}

export enum TypeName {
    Article = "article",
    ClassifierData = "classifier data",
}

export interface StoryPinData {
    node_id: string;
    pages_preview: Page[];
    last_edited: null;
    is_deleted: boolean;
    id: string;
    type: string;
    has_product_pins: boolean;
    total_video_duration: number;
    pages: Page[];
    metadata: Metadata;
    page_count: number;
    static_page_count: number;
    has_affiliate_products: boolean;
}

export interface Metadata {
    pin_title: string;
    version: string;
    pin_image_signature: string;
    recipe_data: null;
    showreel_data: null;
    compatible_version: string;
    is_promotable: boolean;
    root_pin_id: string;
    is_editable: boolean;
    root_user_id: string;
    template_type: null;
    basics: null;
    is_compatible: boolean;
    diy_data: null;
    canvas_aspect_ratio: number;
}

export interface Page {
    blocks: Block[];
}

export interface Block {
    tracking_id: string;
    block_style: BlockStyle;
    text: string;
    image_signature: string;
    image: null;
    type: string;
    block_type: number;
}

export interface BlockStyle {
    y_coord: number;
    rotation: number;
    corner_radius: number;
    width: number;
    x_coord: number;
    height: number;
}

export enum TrackingParams {
    CwABAAAAEDExNTM1OTY0NjcwNjMXMTMGAAMAlQsABWAAAApuZ2FwaS9Wcm9KAA = "CwABAAAAEDExNTM1OTY0NjcwNjMxMTMGAAMAlQsABwAAAApuZ2FwaS9wcm9kAA",
}

export enum DatumType {
    Pin = "pin",
}
