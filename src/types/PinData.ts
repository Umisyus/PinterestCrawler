export interface PinData {
    resource_response:  ResourceResponse;
    client_context:     ClientContext;
    resource:           Resource;
    request_identifier: string;
}

export interface ClientContext {
    analysis_ua:                    AnalysisUa;
    app_type_detailed:              number;
    app_version:                    string;
    batch_exp:                      boolean;
    browser_locale:                 string;
    browser_name:                   string;
    browser_type:                   number;
    browser_version:                string;
    country:                        string;
    country_from_hostname:          string;
    country_from_ip:                string;
    csp_nonce:                      string;
    current_url:                    string;
    debug:                          boolean;
    deep_link:                      string;
    enabled_advertiser_countries:   string[];
    facebook_token:                 null;
    full_path:                      string;
    http_referrer:                  string;
    impersonator_user_id:           null;
    invite_code:                    string;
    invite_sender_id:               string;
    is_authenticated:               boolean;
    is_bot:                         string;
    is_full_page:                   boolean;
    is_mobile_agent:                boolean;
    is_sterling_on_steroids:        boolean;
    is_tablet_agent:                boolean;
    language:                       string;
    locale:                         string;
    origin:                         string;
    path:                           string;
    placed_experiences:             null;
    referrer:                       null;
    region_from_ip:                 string;
    request_host:                   string;
    request_identifier:             string;
    social_bot:                     string;
    stage:                          string;
    sterling_on_steroids_ldap:      null;
    sterling_on_steroids_user_type: null;
    theme:                          string;
    unauth_id:                      string;
    seo_debug:                      boolean;
    user_agent_can_use_native_app:  boolean;
    user_agent_platform:            string;
    user_agent_platform_version:    null;
    user_agent:                     string;
    user:                           User;
    utm_campaign:                   null;
    visible_url:                    string;
}

export interface AnalysisUa {
    app_type:        number;
    app_version:     string;
    browser_name:    string;
    browser_version: string;
    device_type:     null;
    device:          string;
    os_name:         string;
    os_version:      string;
}

export interface User {
    unauth_id:  string;
    ip_country: string;
    ip_region:  string;
}

export interface Resource {
    name:    string;
    options: Options;
}

export interface Options {
    bookmarks:           string[];
    add_vase:            boolean;
    field_set_key:       string;
    is_own_profile_pins: boolean;
    username:            string;
}

export interface ResourceResponse {
    status:                        string;
    code:                          number;
    message:                       string;
    endpoint_name:                 string;
    data:                          Datum[];
    bookmark:                      string;
    x_pinterest_sli_endpoint_name: string;
    http_status:                   number;
}

export interface Datum {
    node_id:                             string;
    alt_text:                            null;
    tracking_params:                     TrackingParams;
    recommendation_reason:               null;
    grid_title:                          string;
    story_pin_data_id:                   null | string;
    is_eligible_for_pdp:                 boolean;
    sponsorship:                         null;
    video_status:                        null;
    is_eligible_for_aggregated_comments: boolean;
    is_eligible_for_related_products:    boolean;
    is_oos_product:                      boolean;
    utm_link:                            null;
    description:                         string;
    call_to_action_text:                 null;
    images:                              { [key: string]: Image };
    id:                                  string;
    native_creator:                      Pinner | null;
    promoter:                            null;
    is_stale_product:                    boolean;
    pinner:                              Pinner;
    promoted_is_lead_ad:                 boolean;
    insertion_id:                        null;
    product_pin_data:                    null;
    image_crop:                          ImageCrop;
    created_at:                          string;
    digital_media_source_type:           number | null;
    image_signature:                     string;
    origin_pinner:                       Pinner | null;
    promoted_is_removable:               boolean;
    promoted_lead_form:                  null;
    type:                                DatumType;
    seo_title:                           string;
    board:                               Board;
    video_status_message:                null;
    campaign_id:                         null;
    link_utm_applicable_and_replaced:    number;
    reaction_counts:                     { [key: string]: number };
    pin_join:                            PinJoin;
    should_open_in_stream:               boolean;
    link:                                null | string;
    shopping_flags:                      any[];
    ad_match_reason:                     number;
    is_downstream_promotion:             boolean;
    domain:                              Domain;
    source_interest:                     null;
    embed:                               null;
    videos:                              null;
    seo_noindex_reason:                  null | string;
    tracked_link:                        null | string;
    auto_alt_text:                       null | string;
    is_eligible_for_web_closeup:         boolean;
    has_required_attribution_provider:   boolean;
    rich_summary:                        RichSummary | null;
    story_pin_data:                      StoryPinData | null;
    product_metadata:                    null;
    seo_url:                             string;
    dominant_color:                      string;
    attribution:                         null;
}

export interface Board {
    node_id:             string;
    image_thumbnail_url: string;
    name:                string;
    url:                 string;
    privacy:             Privacy;
    id:                  string;
    type:                BoardType;
}

export enum Privacy {
    Public = "public",
}

export enum BoardType {
    Board = "board",
}

export enum Domain {
    ChocolatecoveredkatieCOM = "chocolatecoveredkatie.com",
    OmgchocolatedessertsCOM = "omgchocolatedesserts.com",
    UploadedByUser = "Uploaded by user",
}

export interface ImageCrop {
    min_y: number;
    max_y: number;
}

export interface Image {
    width:  number;
    height: number;
    url:    string;
}

export interface Pinner {
    node_id:                   string;
    full_name:                 string;
    image_small_url:           string;
    explicitly_followed_by_me: boolean;
    is_ads_only_profile:       boolean;
    username:                  string;
    ads_only_profile_site:     null;
    id:                        string;
    type:                      PinnerType;
}

export enum PinnerType {
    User = "user",
}

export interface PinJoin {
    canonical_pin:          CanonicalPin;
    seo_canonical_url:      string;
    visual_annotation:      string[];
    annotations_with_links: { [key: string]: AnnotationsWithLink };
    shopping_klp_urls:      null;
    seo_canonical_domain:   string;
}

export interface AnnotationsWithLink {
    url:  string;
    name: string;
}

export interface CanonicalPin {
    id: string;
}

export interface RichSummary {
    url:                     string;
    apple_touch_icon_images: IconImages;
    favicon_images:          IconImages;
    products:                any[];
    display_cook_time?:      number;
    display_name:            string;
    apple_touch_icon_link:   string;
    site_name:               string;
    actions:                 any[];
    type_name:               string;
    id:                      string;
    favicon_link:            string;
    aggregate_rating?:       AggregateRating;
    display_description:     string;
    type:                    string;
}

export interface AggregateRating {
    name:                null;
    rating_value:        string;
    review_count:        number;
    id:                  string;
    type:                string;
    rating_distribution: any[];
}

export interface IconImages {
    orig: string;
}

export interface StoryPinData {
    node_id:                string;
    metadata:               Metadata;
    pages_preview:          Page[];
    is_deleted:             boolean;
    total_video_duration:   number;
    page_count:             number;
    static_page_count:      number;
    has_affiliate_products: boolean;
    pages:                  Page[];
    last_edited:            null;
    has_product_pins:       boolean;
    id:                     string;
    type:                   string;
}

export interface Metadata {
    showreel_data:       null;
    is_promotable:       boolean;
    root_user_id:        string;
    diy_data:            null;
    root_pin_id:         string;
    pin_title:           string;
    basics:              null;
    recipe_data:         null;
    version:             string;
    compatible_version:  string;
    template_type:       null;
    is_editable:         boolean;
    canvas_aspect_ratio: number;
    pin_image_signature: string;
    is_compatible:       boolean;
}

export interface Page {
    blocks: Block[];
}

export interface Block {
    block_type:      number;
    image_signature: string;
    block_style:     BlockStyle;
    text:            string;
    tracking_id:     string;
    type:            string;
    image:           null;
}

export interface BlockStyle {
    height:        number;
    width:         number;
    rotation:      number;
    x_coord:       number;
    y_coord:       number;
    corner_radius: number;
}

export enum TrackingParams {
    CwABAAAAEDIyMTMyMTMyNjIwNjAzNzYGAAMAlQsABWAAAApuZ2FwaS9Wcm9KAA = "CwABAAAAEDIyMTMyMTMyNjIwNjAzNzYGAAMAlQsABwAAAApuZ2FwaS9wcm9kAA",
}

export enum DatumType {
    Pin = "pin",
}
