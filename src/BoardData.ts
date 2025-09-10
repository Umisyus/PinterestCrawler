export interface BoardFeedResource {
    resource_response: ResourceResponse;
    client_context: ClientContext;
    resource: Resource;
    request_identifier: string;
}

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
    add_vase: boolean;
    board_id: string;
    field_set_key: string;
    filter_section_pins: boolean;
    is_react: boolean;
    prepend: boolean;
    page_size: number;
    rerankMethod: string;
}

export interface ResourceResponse {
    status: string;
    code: number;
    message: string;
    endpoint_name: string;
    data: BoardPinData[];
    x_pinterest_sli_endpoint_name: string;
    http_status: number;
}

export interface BoardPinData {
    node_id: string;
    story_pin_data: StoryPinData | null;
    is_eligible_for_related_products: boolean;
    is_go_linkless: boolean;
    auto_alt_text: string;
    link_utm_applicable_and_replaced: number;
    favorite_user_count: number;
    image_crop: ImageCrop;
    title: string;
    video_status_message: null;
    is_eligible_for_pdp: boolean;
    embed: null;
    story_pin_data_id: null | string;
    board: Board;
    seo_alt_text: string;
    domain: string;
    promoted_is_lead_ad: boolean;
    aggregated_pin_data: AggregatedPinData;
    is_repin: boolean;
    images: { [key: string]: Image };
    should_open_in_stream: boolean;
    product_pin_data: null;
    type: string;
    is_oos_product: boolean;
    creator_analytics: null;
    id: string;
    is_promoted: boolean;
    promoter: Pinner | null;
    is_downstream_promotion: boolean;
    debug_info_html: null;
    link: null | string;
    videos: Videos | null;
    is_stale_product: boolean;
    is_quick_promotable: boolean;
    favorited_by_me: boolean;
    access: any[];
    is_native: boolean;
    pinner: Pinner;
    promoted_lead_form: null;
    pin_join: PinJoin;
    link_domain: null;
    call_to_action_text: null;
    has_required_attribution_provider: boolean;
    seo_url: string;
    image_signature: string;
    shopping_flags: any[];
    attribution: null;
    tracking_params: string;
    grid_title: string;
    utm_link: null;
    insertion_id: null | string;
    digital_media_source_type: null;
    campaign_id: number | null;
    done_by_me: boolean;
    carousel_data: null;
    reaction_counts: { [key: string]: number };
    unified_user_note: string;
    category: string;
    rich_summary: RichSummary | null;
    dominant_color: string;
    alt_text: null;
    native_creator: Pinner | null;
    collection_pin: null;
    sponsorship: null;
    description: string;
    product_metadata: null;
    video_status: null;
    repin_count: number;
    promoted_is_removable: boolean;
    pin_promotion_id?: number;
    advertiser_id?: string;
}

export interface AggregatedPinData {
    node_id: string;
    has_xy_tags: boolean;
    did_it_data: DidItData;
    aggregated_stats: AggregatedStats;
    creator_analytics: null;
    id: string;
    is_shop_the_look: boolean;
}

export interface AggregatedStats {
    done: number;
}

export interface DidItData {
    images_count: number;
    tags: any[];
    videos_count: number;
    details_count: number;
    type: string;
    user_count: number;
    recommend_scores: RecommendScore[];
    responses_count: number;
    recommended_count: number;
    rating: number;
}

export interface RecommendScore {
    score: number;
    count: number;
}

export interface Board {
    node_id: string;
    is_collaborative: boolean;
    layout: string;
    name: string;
    collaborated_by_me: boolean;
    owner: Pinner;
    type: string;
    privacy: string;
    id: string;
    followed_by_me: boolean;
    url: string;
}

export interface Pinner {
    node_id: NodeID;
    image_medium_url: string;
    is_primary_website_verified: boolean;
    full_name: FullName;
    is_verified_merchant: boolean;
    verified_identity: VerifiedIdentity;
    username: Username;
    image_small_url: string;
    id: string;
}

export enum FullName {
    Empty = "\u00ad",
    HomalsionCOM = "homalsion.com",
    SkayaSiberian = "Skaya Siberian",
    Umit = "Umit",
}

export enum NodeID {
    VXNlcjo1Nzg4NTM0OTU3NjQwMTI5OTQ = "VXNlcjo1Nzg4NTM0OTU3NjQwMTI5OTQ=",
    VXNlcjo2MjM1Mzc2NDgzMTcwMTAxMDk = "VXNlcjo2MjM1Mzc2NDgzMTcwMTAxMDk=",
    VXNlcjo2NDY0Nzc4NTg5MTg5MzE1NjU = "VXNlcjo2NDY0Nzc4NTg5MTg5MzE1NjU=",
    VXNlcjo2NzI0NDM5MjU1MjAzODY4Mjg = "VXNlcjo2NzI0NDM5MjU1MjAzODY4Mjg=",
}

export enum Username {
    Dracana96 = "dracana96",
    Homalsion2024 = "homalsion2024",
    Skayasiberian = "skayasiberian",
    Tastemakerrs = "tastemakerrs",
}

export interface VerifiedIdentity {
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

export interface PinJoin {
    canonical_pin: CanonicalPin | null;
    visual_annotation: string[];
    shopping_klp_urls: null;
    annotations_with_links: { [key: string]: AnnotationsWithLink };
}

export interface AnnotationsWithLink {
    url: string;
    name: string;
}

export interface CanonicalPin {
    id: string;
}

export interface RichSummary {
    apple_touch_icon_images: IconImages | null;
    type_name: string;
    is_soft_404?: boolean;
    site_name: string;
    products: any[];
    apple_touch_icon_link: null | string;
    display_name: string;
    favicon_link: string;
    actions: any[];
    type: string;
    favicon_images: IconImages;
    id: string;
    display_description: string;
    url: string;
}

export interface IconImages {
    orig: string;
}

export interface StoryPinData {
    node_id: string;
    pages: Page[];
    metadata: Metadata;
    total_video_duration: number;
    pages_preview: PagesPreview[];
    static_page_count: number;
    page_count: number;
    last_edited: null;
    type: string;
    is_deleted: boolean;
    has_product_pins: boolean;
    has_affiliate_products: boolean;
    id: string;
}

export interface Metadata {
    root_pin_id: string;
    showreel_data: null;
    compatible_version: string;
    recipe_data: null;
    basics: null;
    version: string;
    is_compatible: boolean;
    template_type: null;
    pin_image_signature: string;
    canvas_aspect_ratio: number;
    is_promotable: boolean;
    root_user_id: string;
    is_editable: boolean;
    pin_title: string;
    diy_data: null;
}

export interface Page {
    blocks: PageBlock[];
}

export interface PageBlock {
    video?: Video;
    block_type: number;
    type?: string;
    image_signature?: string;
    text?: string;
    tracking_id?: string;
    image?: null;
    block_style?: BlockStyle;
}

export interface BlockStyle {
    x_coord: number;
    height: number;
    corner_radius: number;
    y_coord: number;
    width: number;
    rotation: number;
}

export interface Video {
    video_list: VideoVideoList;
    id: string;
    bitrates: null;
}

export interface VideoVideoList {
    V_HLSV3_MOBILE: VExp3;
    V_EXP7: VExp3;
    V_EXP4: VExp3;
    V_EXP6: VExp3;
    V_EXP3: VExp3;
    V_EXP5: VExp3;
}

export interface VExp3 {
    width: number;
    height: number;
    duration: number;
    url: string;
    thumbnail: string;
    captions_urls: null;
    best_captions_url: null;
    block_id: string;
    bitrates: null;
}

export interface PagesPreview {
    blocks: PagesPreviewBlock[];
}

export interface PagesPreviewBlock {
    video: Video;
    block_type: number;
}

export interface Videos {
    node_id: string;
    id: string;
    video_list: { [key: string]: VideoListValue };
}

export interface VideoListValue {
    url: string;
    width: number;
    height: number;
    duration: number;
    thumbnail: string;
    captions_urls: VerifiedIdentity;
}
