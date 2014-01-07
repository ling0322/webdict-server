class CreateCandidates < ActiveRecord::Migration
  def change
    create_table :candidates do |t|
      t.string :text
      t.text :examples

      t.timestamps
    end
  end
end
