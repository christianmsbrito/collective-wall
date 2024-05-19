class CreateContributions < ActiveRecord::Migration[7.0]
  def change
    create_table :contributions do |t|
      t.references :wall, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :content

      t.timestamps
    end
  end
end
