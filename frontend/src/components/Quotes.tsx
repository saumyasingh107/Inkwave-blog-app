const Quotes = ({type}:{type:"signin"|"signup"}) => {
  return (
    <div className="h-screen bg-gray-300 flex justify-center flex-col">
      <div className="flex justify-center">
        <div className="max-w-lg">
          <div className="text-3xl font-bold ">
            {type==="signin"?`"Welcome back to where your thoughts find a voice. Let's get you back to writing your story."`:`"Join us today and start sharing your ideas with the world. Every great story begins with a single step"`}
          </div>
          <div className="max-w-md font-semibold mt-3 text-xl">
            Jules Winfield
          </div>
          <div className="max-w-md text-slate-500 font-normal">
            CEO | Acme Inc
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
