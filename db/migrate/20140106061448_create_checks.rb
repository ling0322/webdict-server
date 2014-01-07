class CreateChecks < ActiveRecord::Migration
  def change
    create_table :checks do |t|
      t.string :candidate
      t.boolean :is_word
      t.string :user_uuid

      t.timestamps
    end
  end
end
