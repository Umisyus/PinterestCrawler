export interface PinItType {
    requestParameters: RequestParameters;
    variables: Variables;
    response: Response;
}

export interface RequestParameters {
    id: string;
    metadata: Metadata;
    name: string;
    operationKind: string;
    text: null;
}

export interface Metadata {
}

export interface Response {
    data: ResponseData;
}

export interface ResponseData {
    v3GetPinQuery: V3GetPinQuery;
}

export interface V3GetPinQuery {
    __typename: string;
    data: V3GetPinQueryData;
}

export interface V3GetPinQueryData {
    adData: null;
    description: string;
    dominantColor: string;
    embed: null;
    gridDescription: string;
    gridTitle: string;
    imageSpec_236x: ImageSpec236X;
    imageSignature: string;
    isEligibleForPdp: boolean;
    richSummary: null;
    richMetadata: null;
    storyPinDataId: null;
    seoTitle: string;
    videos: Videos;
    board: Board;
    closeupAttribution: CloseupAttribution;
    commentsDisabled: boolean;
    createdAt: string;
    domain: string;
    images: Image;
    isDownstreamPromotion: boolean;
    isEligibleForAggregatedComments: boolean;
    isGoLinkless: boolean;
    isInstagramApi: boolean;
    isPromoted: boolean;
    isV1IdeaPin: null;
    pinJoin: PinJoin;
    link: null;
    linkDomain: null;
    linkUserWebsite: null;
    mobileLink: null;
    nativeCreator: NativeCreator;
    pinnedToBoard: null;
    pinner: Pinner;
    promotedIsRemovable: boolean;
    recommendationReason: null;
    section: null;
    shouldOpenInStream: boolean;
    storyPinData: null;
    thirdPartyPinOwner: null;
    trackedLink: null;
    utmLink: null;
    trackingParams: string;
    imageSpec_orig: ImageSpecOrig;
    imageLargeUrl: string;
    seoAltText: string;
    isHidden: boolean;
    isUnsafe: boolean;
    promoter: null;
    imageSpec_136x136: ImageSpec136_X136;
    shuffle: null;
    imageSpec_60x60: Image;
    imageSpec_170x: Image;
    imageSpec_474x: Image;
    imageSpec_564x: Image;
    imageSpec_736x: Image;
    imageSpec_600x315: Image;
    digitalMediaSourceType: null;
    isViewedByOwnerOrEmployeeOrPartnerOfBusiness: null;
    visualObjects: VisualObject[];
    category: string;
    closeupUnifiedDescription: string;
    entityId: string;
    title: string;
    shouldMute: boolean;
    musicAttributions: any[];
    linkUtmApplicableAndReplaced: number;
    isOosProduct: boolean;
    isStaleProduct: boolean;
    shoppingFlags: any[];
    originPinner: OriginPinner;
    aggregatedPinData: AggregatedPinData;
    imageSpec_236: Image;
    imageSpec_474: Image;
    imageSpec_736: Image;
    mediaAttribution: null;
    id: string;
}

export interface AggregatedPinData {
    aggregatedStats: AggregatedStats;
    id: string;
}

export interface AggregatedStats {
    saves: null;
}

export interface Board {
    collaboratedByMe: boolean;
    collaboratorPermissions: null;
    entityId: string;
    isCollaborative: boolean;
    owner: Owner;
    url: string;
    id: string;
    followedByMe: boolean;
}

export interface Owner {
    entityId: string;
    id: string;
}

export interface CloseupAttribution {
    fullName: string;
    id: string;
}

export interface ImageSpec136_X136 {
    height: number;
    width: number;
    url: string;
    captionsUrls?: CaptionsUrls;
}

export interface CaptionsUrls {
    "te-in": string;
}

export interface Image {
    url: string;
}

export interface ImageSpec236X {
    dominantColor: null;
    height: number;
    type: null;
    url: string;
    width: number;
}

export interface ImageSpecOrig {
    __typename: string;
    url: string;
}

export interface NativeCreator {
    __typename: string;
    websiteUrl: string;
    isPrimaryWebsiteVerified: boolean;
    isDirectToSiteAllowed: boolean;
    id: string;
    username: string;
}

export interface OriginPinner {
    entityId: string;
    id: string;
    username: string;
}

export interface PinJoin {
    visualAnnotation: string[];
    seoBreadcrumbs: SEOBreadcrumb[];
}

export interface SEOBreadcrumb {
    name: string;
    url: string;
}

export interface Pinner {
    domainUrl: null;
    domainVerified: boolean;
    entityId: string;
    id: string;
    connectionType: string;
    username: string;
    explicitlyFollowedByMe: boolean;
    blockedByMe: boolean;
}

export interface Videos {
    videoUrls: string[];
    id: string;
    entityId: string;
    videoList: VideoList;
}

export interface VideoList {
    __typename: string;
    vHLSV4: ImageSpec136_X136;
    v720P: ImageSpec136_X136;
}

export interface VisualObject {
    isStela: boolean | null;
    h: number;
    w: number;
    x: number;
    y: number;
}

export interface Variables {
    pinId: string;
    isAuth: boolean;
}
