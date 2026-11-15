import UserDetails from '@/components/users/user-details';

type props = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailsPage({ params }: props) {
  const { id } = await params;
  return <UserDetails id={id} />;
}
