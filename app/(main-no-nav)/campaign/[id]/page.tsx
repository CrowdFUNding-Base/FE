import CampaignPage from "@/modules/campaign/CampaignPage";

interface CampaignPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function Campaign({ params }: CampaignPageProps) {
    const { id } = await params;
    return(
        <CampaignPage campaignId={id} />
    )
}