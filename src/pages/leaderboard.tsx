
export default function Leaderboard() {

  const profiles = [
    {
      imageUrl: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      name: 'Tripti Yadav',
      score: 100,
      rank: 1
    },
    {
      imageUrl: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      name: 'Junaid Ahmad',
      score: 100,
      rank: 2
    },
    {
      imageUrl: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      name: 'Anurag Sharma',
      score: 90,
      rank: 3
    },
    {
      imageUrl: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      name: 'Arbaaz Yaseen',
      score: 70,
      rank: 4
    },
    {
      imageUrl: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      name: 'Saurav Lal',
      score: 60,
      rank: 5
    },
    {
      imageUrl: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      name: 'Tejas Mishra',
      score: 50,
      rank: 6
    },
    {
      imageUrl: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      name: 'Umar Ali',
      score: 40,
      rank: 7
    },
    {
      imageUrl: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      name: 'Roushan Kumar',
      score: 30,
      rank: 8
    },
    {
      imageUrl: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      name: 'Rahul Kumar',
      score: 20,
      rank: 9
    },
    {
      imageUrl: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      name: 'Pratiksha Theodore',
      score: 10,
      rank: 10
    }
  ]

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col w-full max-w-[600px]">
        <div className="flex flex-col w-full bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold">Leaderboard</h1>
          </div>
          <div className="flex flex-col w-full mt-4">
            <div className="flex flex-row items-center justify-between bg-gray-100 p-2 rounded-md">
              <div className="flex flex-row items-center">
                <h2 className="text-lg font-semibold">Rank</h2>
              </div>
              <div className="flex flex-row items-center">
                <h2 className="text-lg font-semibold">Name</h2>
              </div>
              <div className="flex flex-row items-center">
                <h2 className="text-lg font-semibold">Score</h2>
              </div>
            </div>
            {profiles.map((profile, index) => (
              <div key={index} className="flex flex-row items-center justify-between bg-gray-100 p-2 rounded-md mt-2">
                <div className="flex flex-row items-center">
                  <h2 className="text-lg font-semibold">{profile.rank}</h2>
                </div>
                <div className="flex flex-row w-[50%] ml-[100px] items-start justify-start">
                  <img className="w-8 h-8 rounded-full" src={profile.imageUrl} alt="profile" />
                  <h2 className="text-lg font-semibold ml-2">{profile.name}</h2>
                </div>
                <div className="flex flex-row items-center">
                  <h2 className="text-lg font-semibold">{profile.score}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}