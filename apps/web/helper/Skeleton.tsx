function Skeleton() {
  return (
    <main className="flex overflow-x-auto hide-scrollbar gap-3 overflow-y-hidden py-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <article key={i} className="mt-4 shrink-0 w-37.5">
          <div className="w-full h-[20vh] `md:h-40 object-cover rounded-2xl  bg-[#121212] animate-pulse"></div>
          <div className="text mt-2 ">
            <p className="  bg-[#121212] rounded-md animate-pulse w-full h-5"></p>
            <p className=" bg-[#121212] text-[10px]  h-5 rounded-md w-full mt-2 animate-pulse"></p>
          </div>
        </article>
      ))}
    </main>
  );
}

export default Skeleton;
