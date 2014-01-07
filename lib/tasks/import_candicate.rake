
task :import, [:path] => :environment do |t, args|
  batch, batch_size = [], 10000
  file_path = args[:path]
  File.open(file_path, "r").each_line do |line|
    line.strip!()
    word, examples = line.split()
    batch << Candidate.new(:text => word, :examples => examples)
    if batch.size >= batch_size
      Candidate.import batch
      batch = []
    end
  end
end